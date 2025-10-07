import React, { useEffect, useState, useRef } from "react";
import "../styles/BookingModal.css";
import { FaCalendarAlt, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router";
import {
  toYMD,
  parseTimeOnly,
  minutesFromHHMM,
  parseHHMMSSToMinutes,
  formatMinutesTo12h,
} from "../../utils/timeUtils";
import { API_BASE } from "../../utils/constants";

function normalizeAvailability(raw) {
  const payload = raw?.data ?? raw;
  const list =
    payload?.courtList ?? payload?.courts ?? payload?.court_list ?? [];

  const normalized = (list || []).map((court) => {
    const rawSlots =
      court.slotInfo ?? court.slotList ?? court.slots ?? court.slotsInfo ?? [];

    const parsed = (rawSlots || [])
      .filter(Boolean)
      .map((s) => {
        const timeRaw = s.time ?? s.slotTime ?? s.startTime ?? "";
        const startStr = parseTimeOnly(timeRaw);
        const startMin = startStr ? minutesFromHHMM(startStr) : null;

        let endStr = null;
        if ((s.time || "").includes("-")) {
          const parts = s.time.split("-");
          endStr = parts[1]?.trim();
        } else if (s.endTime || s.slotEnd) {
          endStr = s.endTime || s.slotEnd;
        }
        const endMin = endStr
          ? minutesFromHHMM(parseTimeOnly(endStr) || endStr)
          : null;

        const price = parseFloat(s.price ?? s.amount ?? s.slotPrice ?? 0) || 0;

        const isAvailable =
          s.status !== 0 ||
          s.status === 1 ||
          s.isAvailable === true ||
          s.available === true ||
          s.status === "1";

        return {
          raw: s,
          startMin,
          endMin,
          price,
          isAvailable,
          rawTimeSmall: timeRaw || startStr,
        };
      })
      .filter((x) => typeof x.startMin === "number")
      .sort((a, b) => a.startMin - b.startMin);

    if (!parsed.length) {
      return {
        courtId:
          court.courtId ??
          court.id ??
          court._id ??
          `${court.courtName}_${Math.random()}`,
        courtName: court.courtName ?? court.label ?? court.name ?? "Court",
        rawCourt: court,
        slots: [],
      };
    }

    let inferredStep = null;
    if (court.slotDuration) {
      const dur = parseHHMMSSToMinutes(court.slotDuration);
      if (dur && dur > 0) inferredStep = dur;
    }
    if (!inferredStep) {
      let minGap = Infinity;
      for (let i = 1; i < parsed.length; i++) {
        const diff = parsed[i].startMin - parsed[i - 1].startMin;
        if (diff > 0 && diff < minGap) minGap = diff;
      }
      inferredStep = isFinite(minGap) && minGap > 0 ? minGap : 60;
    }

    const startMap = new Map();
    parsed.forEach((p) => {
      if (!startMap.has(p.startMin)) startMap.set(p.startMin, p);
    });

    const starts = Array.from(startMap.keys()).sort((a, b) => a - b);
    const used = new Set();
    const merged = [];

    for (let i = 0; i < starts.length; i++) {
      const sMin = starts[i];
      if (used.has(sMin)) continue;
      const sSlot = startMap.get(sMin);
      if (!sSlot) continue;

      if (sSlot.endMin && sSlot.endMin - sSlot.startMin >= 60) {
        merged.push({
          timeRange: `${formatMinutesTo12h(
            sSlot.startMin
          )} - ${formatMinutesTo12h(sSlot.startMin + 60)}`,
          price: sSlot.price,
          isAvailable: !!sSlot.isAvailable,
          original: sSlot.raw,
          displayRaw: `${sSlot.rawTimeSmall}`,
        });
        used.add(sMin);
        continue;
      }

      if (inferredStep >= 60) {
        merged.push({
          timeRange: `${formatMinutesTo12h(
            sSlot.startMin
          )} - ${formatMinutesTo12h(sSlot.startMin + inferredStep)}`,
          price: sSlot.price,
          isAvailable: !!sSlot.isAvailable,
          original: sSlot.raw,
          displayRaw: `${sSlot.rawTimeSmall}`,
        });
        used.add(sMin);
        continue;
      }

      const partnerStart = sMin + inferredStep;
      const partner = startMap.get(partnerStart);

      if (partner && !used.has(partnerStart)) {
        const isAvail = !!sSlot.isAvailable && !!partner.isAvailable;
        const price = +(sSlot.price + partner.price).toFixed(2);
        merged.push({
          timeRange: `${formatMinutesTo12h(
            sSlot.startMin
          )} - ${formatMinutesTo12h(sSlot.startMin + 60)}`,
          price,
          isAvailable: isAvail,
          original: [sSlot.raw, partner.raw],
          displayRaw: `${sSlot.rawTimeSmall} / ${partner.rawTimeSmall}`,
        });
        used.add(sMin);
        used.add(partnerStart);
        continue;
      }

      merged.push({
        timeRange: `${formatMinutesTo12h(
          sSlot.startMin
        )} - ${formatMinutesTo12h(sSlot.startMin + 60)}`,
        price: sSlot.price,
        isAvailable: false,
        original: sSlot.raw,
        displayRaw: sSlot.rawTimeSmall,
        note: "Not available for full hour",
      });
      used.add(sMin);
    }

    return {
      courtId:
        court.courtId ??
        court.id ??
        court._id ??
        `${court.courtName}_${Math.random()}`,
      courtName: court.courtName ?? court.label ?? court.name ?? "Court",
      rawCourt: court,
      slots: merged,
    };
  });

  return { courtList: normalized };
}

const BookingModal = ({
  isOpen,
  onClose,
  venue,
  sports = [],
  onConfirm,
  initialSport = null,
}) => {
  const [selectedSport, setSelectedSport] = useState(initialSport || null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedSlotKeys, setSelectedSlotKeys] = useState([]);
  const [error, setError] = useState(null);
  const [days, setDays] = useState([]);
  const dateInputRef = useRef(null);

  useEffect(() => {
    const buildDays = (start = new Date(), count = 14) => {
      const arr = [];
      for (let i = 0; i < count; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        arr.push(d);
      }
      return arr;
    };
    if (isOpen) {
      setSelectedSport(initialSport || null);
      setSelectedDate(new Date());
      setAvailability(null);
      setSelectedCourt(null);
      setSelectedSlotKeys([]);
      setError(null);
      setDays(buildDays(new Date(), 14));
    }
  }, [isOpen, initialSport]);

  useEffect(() => {
    if (!isOpen) return;
    if (!venue?.venueId || !selectedSport?.sportId || !selectedDate) {
      setAvailability(null);
      return;
    }

    const fetchAvailability = async () => {
      setLoading(true);
      setError(null);
      setAvailability(null);
      setSelectedCourt(null);
      setSelectedSlotKeys([]);
      try {
        const sportCode = encodeURIComponent(
          selectedSport.sportId ||
            selectedSport.sportCode ||
            selectedSport.code ||
            ""
        );
        const url = `${API_BASE}/api/availability?venueId=${encodeURIComponent(
          venue.venueId
        )}&sportCode=${sportCode}&date=${encodeURIComponent(
          toYMD(selectedDate)
        )}`;
        const res = await fetch(url);
        const data = await res.json();
        const normalized = normalizeAvailability(data);
        setAvailability(normalized);
      } catch (err) {
        console.error("BookingModal fetch error:", err);
        setError("Failed to load availability. Try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [isOpen, venue?.venueId, selectedSport, selectedDate]);

  const slotKeyFor = (courtId, slot) =>
    `${courtId}|${slot.timeRange || slot.time}`;

  const handleSlotToggle = (court, slot) => {
    const key = slotKeyFor(court.courtId, slot);
    setSelectedSlotKeys((prev) => {
      const exists = prev.includes(key);
      return exists ? prev.filter((k) => k !== key) : [...prev, key];
    });
  };

  const navigate = useNavigate();

  const confirm = () => {
    if (!selectedCourt) {
      alert("Please select a court.");
      return;
    }
    if (selectedSlotKeys.length === 0) {
      alert("Please select at least one slot.");
      return;
    }

    const chosenSlotObjs = selectedSlotKeys
      .map((k) => {
        const parts = k.split("|");
        const timeRange = parts.slice(1).join("|");
        return selectedCourt.slots.find((s) => s.timeRange === timeRange);
      })
      .filter(Boolean);

    const totalPrice = chosenSlotObjs.reduce(
      (acc, s) => acc + parseFloat(s.price || 0),
      0
    );

    navigate("/booking-success", {
      state: {
        venue,
        sport: selectedSport,
        date: toYMD(selectedDate),
        court: selectedCourt,
        slots: chosenSlotObjs,
        total: totalPrice,
      },
    });

    onClose && onClose();
  };

  const chooseCourt = (court) => {
    setSelectedCourt(court);
    setSelectedSlotKeys([]);
  };

  const minPrice = (() => {
    if (!availability?.courtList) return null;
    let min = Infinity;
    availability.courtList.forEach((c) =>
      (c.slots || []).forEach((s) => {
        const p = parseFloat(s.price || 0);
        if (!isNaN(p) && p < min) min = p;
      })
    );
    return min === Infinity ? null : min;
  })();

  const onCalendarDatePick = (isoDate) => {
    if (!isoDate) return;
    const nd = new Date(isoDate);
    setDays((prev) => {
      const filtered = prev.filter((d) => toYMD(d) !== toYMD(nd));
      const arr = [nd, ...filtered];
      return arr.slice(0, 14);
    });
    setSelectedDate(nd);
    setAvailability(null);
    setSelectedCourt(null);
    setSelectedSlotKeys([]);
  };

  const footerTotal = (() => {
    if (!selectedCourt || selectedSlotKeys.length === 0) return 0;
    return selectedSlotKeys.reduce((acc, k) => {
      const parts = k.split("|");
      const timeRange = parts.slice(1).join("|");
      const slotObj = selectedCourt.slots.find(
        (s) => s.timeRange === timeRange
      );
      return acc + (slotObj ? parseFloat(slotObj.price || 0) : 0);
    }, 0);
  })();

  const isPastSlot = (slot) => {
    if (!slot?.timeRange) return false;
    const [start] = slot.timeRange.split("-");
    const todayYMD = toYMD(new Date());
    if (toYMD(selectedDate) !== todayYMD) return false;
    const now = new Date();
    const [hour, minute] = (() => {
      const t = start.trim().toUpperCase();
      let [hh, mm] = t.replace(/[^\d:]/g, "").split(":");
      hh = parseInt(hh || "0", 10);
      mm = parseInt(mm || "0", 10);
      if (t.includes("PM") && hh < 12) hh += 12;
      if (t.includes("AM") && hh === 12) hh = 0;
      return [hh, mm];
    })();
    const slotTime = new Date();
    slotTime.setHours(hour, minute, 0, 0);
    return slotTime < now;
  };

  return !isOpen ? null : (
    <div className="bm-overlay" role="dialog" aria-modal="true">
      <div className="bm-modal" role="document">
        {/* Sticky header */}
        <div className="bm-header">
          <div className="bm-header-left">
            <div className="bm-venue-name" title={venue?.name}>
              {venue?.name}
            </div>
            <div className="bm-venue-area">{venue?.area}</div>
          </div>

          <div className="bm-header-right">
            <h2 className="bm-book-title">Book Your Slot</h2>
            <div className="bm-book-underline" />
          </div>
        </div>
        {/* SPORTS */}
        <div className="bm-section">
          <h3>Select Sport</h3>
          <div className="bm-sport-list">
            {sports.map((sport, i) => (
              <button
                key={`${
                  sport.sportId || sport._id || sport.name || "sport"
                }-${i}`}
                className={`bm-sport-btn ${
                  selectedSport?.sportId === sport.sportId ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedSport(sport);
                  setAvailability(null);
                  setSelectedCourt(null);
                  setSelectedSlotKeys([]);
                }}
                title={sport.name}
              >
                <img
                  className="bm-sport-icon"
                  src={sport.v2GrayIcon || sport.icon || ""}
                  alt={sport.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://playo.gumlet.io/V3SPORTICONS/SP2.png?w=96&q=75";
                  }}
                />
                <div className="bm-sport-details">
                  <span className="bm-sport-name" title={sport.name}>
                    {sport.name}
                  </span>

                  {selectedSport?.sportId === sport.sportId &&
                    minPrice !== null && (
                      <div className="bm-sport-price">
                        <small className="bm-sport-from">from</small>
                        <span className="bm-sport-price-amt">₹{minPrice}</span>
                      </div>
                    )}
                </div>
              </button>
            ))}
          </div>
        </div>
        {/* DATE STRIP */}
        {selectedSport && (
          <div className="bm-section bm-date-section">
            <h3>Select Date</h3>

            <div className="bm-date-strip-wrapper">
              <div className="bm-date-row">
                <div className="bm-date-strip" role="list">
                  {days.map((d) => {
                    const dateStr = toYMD(d);
                    const isActive = toYMD(selectedDate) === dateStr;
                    const dayName = d.toLocaleDateString(undefined, {
                      weekday: "short",
                    });
                    const dayNum = d.getDate();
                    const monthShort = d.toLocaleDateString(undefined, {
                      month: "short",
                    });
                    return (
                      <button
                        key={dateStr}
                        className={`bm-date-circle ${isActive ? "active" : ""}`}
                        onClick={() => {
                          setSelectedDate(new Date(dateStr));
                          setAvailability(null);
                          setSelectedCourt(null);
                          setSelectedSlotKeys([]);
                        }}
                        title={`${dayName} ${monthShort} ${dayNum}`}
                      >
                        <span className="bm-day">{dayName}</span>
                        <span className="bm-daynum">{dayNum}</span>
                        <span className="bm-month">{monthShort}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="bm-calendar-wrapper">
                  <button
                    className="bm-calendar-btn"
                    aria-label="Open calendar"
                  >
                    <FaCalendarAlt />
                    <input
                      ref={dateInputRef}
                      type="date"
                      min={toYMD(new Date())}
                      value={toYMD(selectedDate)}
                      onChange={(e) => {
                        if (!e.target.value) return;
                        onCalendarDatePick(e.target.value);
                      }}
                      className="bm-native-date"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {loading && (
          <div className="bm-shimmer-container">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bm-shimmer-card"></div>
            ))}
          </div>
        )}
        {error && <div className="bm-error">{error}</div>}
        {/* COURTS */}
        {!loading && selectedSport && availability?.courtList?.length > 0 && (
          <div className="bm-section">
            <h3>Select Court</h3>
            <div className="bm-court-list">
              {availability.courtList.map((court) => (
                <button
                  key={court.courtId}
                  className={`bm-court-btn ${
                    selectedCourt?.courtId === court.courtId ? "active" : ""
                  }`}
                  onClick={() => chooseCourt(court)}
                >
                  <div className="bm-court-left">
                    <div className="bm-court-name">{court.courtName}</div>
                    <div className="bm-court-meta">
                      {court.slots?.length ?? 0} slots
                    </div>
                  </div>
                  <div className="bm-court-right">
                    {selectedCourt?.courtId === court.courtId && (
                      <div className="bm-court-check">
                        <FaCheck />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SLOTS */}
        {selectedCourt && (
          <div className="bm-section">
            <h3>Select Slots</h3>
            <div className="bm-slot-list">
              {selectedCourt.slots.map((slot) => {
                const key = slotKeyFor(selectedCourt.courtId, slot);
                const active = selectedSlotKeys.includes(key);
                const disabled = !slot.isAvailable;
                const faded = isPastSlot(slot);

                const minCourtPrice = Math.min(
                  ...selectedCourt.slots
                    .filter((s) => s.isAvailable)
                    .map((s) => s.price)
                );

                let statusClass = "";
                if (disabled) statusClass = "bm-slot-red-box";
                else if (slot.price === minCourtPrice)
                  statusClass = "bm-slot-green";
                else statusClass = "bm-slot-yellow";

                return (
                  <button
                    key={key}
                    className={`bm-slot-btn ${
                      active ? "active" : ""
                    } ${statusClass} ${faded ? "bm-slot-faded" : ""}`}
                    onClick={() =>
                      !disabled &&
                      !faded &&
                      handleSlotToggle(selectedCourt, slot)
                    }
                    disabled={disabled || faded}
                    title={slot.note || slot.displayRaw || ""}
                  >
                    <div className="bm-slot-time">{slot.timeRange}</div>
                    <div className="bm-slot-price">
                      <span
                        className={`bm-slot-price-amt ${
                          disabled || faded ? "disabled-price" : ""
                        }`}
                      >
                        ₹{slot.price}
                      </span>
                    </div>
                    {slot.note && (
                      <div className="bm-slot-note">{slot.note}</div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="bm-slot-legend">
              <div>
                <span className="bm-slot-dot green"></span> Least Price /
                Available
              </div>
              <div>
                <span className="bm-slot-dot yellow"></span> Higher Price
              </div>
              <div>
                <span className="bm-slot-dot red"></span> Unavailable
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        {!loading && (
          <div className="bm-footer">
            <button className="bm-cancel" onClick={onClose}>
              Cancel
            </button>
            <div className="bm-footer-center">
              <div className="bm-footer-total-label">Total</div>
              <div className="bm-footer-total-amt">₹{footerTotal}</div>
            </div>
            <button
              className="bm-confirm"
              onClick={confirm}
              disabled={!selectedCourt || selectedSlotKeys.length === 0}
            >
              Confirm Booking{" "}
              {selectedSlotKeys.length > 0
                ? `(${selectedSlotKeys.length})`
                : ""}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
