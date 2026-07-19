import type { Service } from "./services";

export function ServiceRow({ service }: { service: Service }) {
  return (
    <li>
      <a
        className="service-row"
        href={service.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="service-index">{service.index}</span>
        <span className="service-name">{service.name}</span>
        <span className="service-meta">
          <span className="service-desc">{service.description}</span>
          <span className="service-url">{new URL(service.url).host} ↗</span>
        </span>
      </a>
    </li>
  );
}
