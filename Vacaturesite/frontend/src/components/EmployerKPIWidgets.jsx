import React from "react";

export default function EmployerKPIWidgets() {
  return (
    <div className="employer-kpi-widgets">
      <div className="kpi-widget live-jobs">
        <strong>Live vacatures</strong>
        <div>4 live / 1 in review / 2 verlopen</div>
        <button className="btn-primary">Nieuwe vacature</button>
      </div>
      <div className="kpi-widget funnel">
        <strong>Funnel (30 dagen)</strong>
        <div>Views: 1.200 → Kliks: 320 → Sollicitaties: 28</div>
        <div>Conversie: 2,3%</div>
      </div>
      <div className="kpi-widget time-to-fill">
        <strong>Time-to-fill</strong>
        <div>VVT: 18 dgn | Thuiszorg: 22 dgn</div>
      </div>
      <div className="kpi-widget channel-conv">
        <strong>Bronconversie</strong>
        <div>Site: 12 | Alerts: 8 | Indeed: 6 | Regionaal: 2</div>
        <div>CPA: €34 / sollicitatie</div>
      </div>
    </div>
  );
}
