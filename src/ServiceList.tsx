import { services } from "./services";
import { ServiceRow } from "./ServiceRow";

export function ServiceList() {
  // 3 カラムグリッドの最終行を埋め、区切り線の枠を保つための空セル数
  const columns = 3;
  const fillers = (columns - (services.length % columns)) % columns;

  return (
    <section className="services-wrap">
      <ul className="services">
        {services.map((s) => (
          <ServiceRow key={s.name} service={s} />
        ))}
        {Array.from({ length: fillers }).map((_, i) => (
          <li key={`filler-${i}`} className="service-cell service-cell-filler" aria-hidden="true" />
        ))}
      </ul>
    </section>
  );
}
