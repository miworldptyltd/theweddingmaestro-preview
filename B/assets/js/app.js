(function(){
  const EMAIL_TO = "info@miworld.tech";
  const blocked = ["2026-04-18","2026-05-09","2026-06-20"];

  function buildMailto(d){
    const subject = `${d.eventType} enquiry — ${d.eventDate || "date TBD"} — ${d.name || "Client"}`;
    const lines = [
      `BUSINESS: The Wedding Maestro`,
      ``,
      `Client details`,
      `- Name: ${d.name}`,
      `- Email: ${d.email}`,
      `- Phone: ${d.phone}`,
      ``,
      `Event`,
      `- Type: ${d.eventType}`,
      `- Date: ${d.eventDate}`,
      `- Start time: ${d.startTime}`,
      `- Duration: ${d.duration}`,
      `- Guests: ${d.guests}`,
      `- Venue: ${d.venue}`,
      `- Suburb/City: ${d.suburb}`,
      ``,
      `Services requested`,
      `- DJ: ${d.wantDJ ? "Yes" : "No"}`,
      `- MC: ${d.wantMC ? "Yes" : "No"}`,
      `- Ceremony audio: ${d.wantCeremony ? "Yes" : "No"}`,
      `- Lighting: ${d.wantLighting ? "Yes" : "No"}`,
      ``,
      `Photo/video consent`,
      `- Client acknowledges and allows media use: ${d.consentMedia ? "Yes" : "No"}`,
      ``,
      `Notes`,
      `${d.notes || "(none)"}`,
      ``,
      `---`,
      `Submitted via website demo form (mailto).`
    ];
    const body = lines.join("\n");
    return `mailto:${encodeURIComponent(EMAIL_TO)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function qs(sel, root=document){ return root.querySelector(sel); }

  document.addEventListener("DOMContentLoaded", ()=>{
    document.querySelectorAll('.js-year').forEach(n=>n.textContent=new Date().getFullYear());

    const form = qs("#enquiryForm");
    if(!form) return;

    const out = qs("#availabilityResult");
    const btn = qs("#checkAvailability");
    const msg = qs("#formMsg");

    function getData(){
      const fd = new FormData(form);
      return {
        name: fd.get("name")||"",
        email: fd.get("email")||"",
        phone: fd.get("phone")||"",
        eventType: fd.get("eventType")||"",
        eventDate: fd.get("eventDate")||"",
        startTime: fd.get("startTime")||"",
        duration: fd.get("duration")||"",
        guests: fd.get("guests")||"",
        venue: fd.get("venue")||"",
        suburb: fd.get("suburb")||"",
        notes: fd.get("notes")||"",
        wantDJ: !!fd.get("wantDJ"),
        wantMC: !!fd.get("wantMC"),
        wantCeremony: !!fd.get("wantCeremony"),
        wantLighting: !!fd.get("wantLighting"),
        consentMedia: !!fd.get("consentMedia"),
      };
    }

    if(btn && out){
      btn.addEventListener("click", (e)=>{
        e.preventDefault();
        const d = getData();
        if(!d.eventDate){
          out.textContent = "Select a date first.";
          return;
        }
        out.textContent = blocked.includes(d.eventDate)
          ? "This date looks busy (demo). Please submit anyway and we’ll confirm."
          : "Looks available (demo). Submit your enquiry to confirm.";
      });
    }

    form.addEventListener("submit", (e)=>{
      e.preventDefault();
      const d = getData();
      const required = ["name","email","phone","eventType","eventDate","startTime","duration"];
      const missing = required.some(k=>!String(d[k]).trim());
      if(missing){
        msg.textContent = "Please complete all required fields (name, email, phone, event, date, start time, duration).";
        msg.scrollIntoView({behavior:"smooth", block:"center"});
        return;
      }
      if(!d.consentMedia){
        msg.textContent = "Please tick the photo/video acknowledgement to continue.";
        msg.scrollIntoView({behavior:"smooth", block:"center"});
        return;
      }
      msg.textContent = "";
      window.location.href = buildMailto(d);
    });
  });
})();
