import { services } from "./services";
import { ServiceRow } from "./ServiceRow";

export function ServiceList() {
  return (
    <ul className="services">
      {services.map((s) => (
        <ServiceRow key={s.name} service={s} />
      ))}
    </ul>
  );
}
