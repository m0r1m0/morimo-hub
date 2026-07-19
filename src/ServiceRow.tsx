import { splitServiceName, type Service } from "./services";

export function ServiceRow({ service }: { service: Service }) {
  const { prefix, suffix } = splitServiceName(service.name);

  return (
    <li className="service-cell">
      <a
        className="service-link"
        href={service.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="service-index">{service.index}</span>
        <span className="service-name">
          <span style={{ color: service.accent }}>{prefix}</span>
          {suffix && <span className="service-name-rest">{suffix}</span>}
        </span>
        <span className="service-desc">{service.description}</span>
        <span className="service-url">{new URL(service.url).host} ↗</span>
      </a>
    </li>
  );
}
