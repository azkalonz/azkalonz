import type { ResponsiveAppViewport } from "./responsiveAppGeometry";
import { HeroSceneGrid } from "./HeroSceneChrome";

const navigationItems = [
  { id: "orders", label: "Orders" },
  { id: "inventory", label: "Inventory" },
  { id: "shipments", label: "Shipments" },
  { id: "tracking", label: "Tracking" },
] as const;

const orderRows = [
  { id: "order-a", primary: "wide", secondary: "short" },
  { id: "order-b", primary: "medium", secondary: "wide" },
  { id: "order-c", primary: "short", secondary: "medium" },
  { id: "order-d", primary: "medium", secondary: "short" },
] as const;

const detailFields = ["Customer", "Destination", "Carrier", "Service"] as const;

type WireLength = "short" | "medium" | "wide";

type WireLineProps = {
  length: WireLength;
};

const WireLine = ({ length }: WireLineProps) => (
  <span
    className={`responsive-app-scene__wire responsive-app-scene__wire--${length}`}
  />
);

const ResponsiveAppScene = ({
  initialViewport,
}: {
  initialViewport?: ResponsiveAppViewport;
}) => (
  <div className="responsive-app-scene" data-responsive-scene>
    <div className="responsive-app-scene__stage" data-responsive-stage>
      <div
        className="responsive-app-scene__camera"
        data-responsive-camera
        style={
          initialViewport
            ? {
                transform: `translate3d(${initialViewport.x}px, ${initialViewport.y}px, 0) scale(${initialViewport.zoom})`,
              }
            : undefined
        }
      >
        <HeroSceneGrid />
        <div
          className="responsive-app-scene__shell"
          data-responsive-app-shell
          data-responsive-layout="desktop"
        >
          <div
            className="responsive-app-scene__browser-chrome"
            data-responsive-browser-chrome
            aria-hidden="true"
          >
            <span className="responsive-app-scene__browser-actions">
              <i />
              <i />
              <i />
            </span>
            <span className="responsive-app-scene__browser-address">
              orders.workspace
            </span>
          </div>

          <div
            className="responsive-app-scene__phone-hardware"
            data-responsive-phone-hardware
            aria-hidden="true"
          >
            <span className="responsive-app-scene__phone-time">9:41</span>
            <span className="responsive-app-scene__phone-island" />
            <span className="responsive-app-scene__phone-signal">
              <i />
              <i />
              <i />
            </span>
            <span className="responsive-app-scene__phone-home" />
          </div>

          <div
            className="responsive-app-scene__header"
            data-responsive-region="header"
            data-responsive-interior
          >
            <div className="responsive-app-scene__brand">
              <span className="responsive-app-scene__brand-mark" />
              <span>Operations</span>
            </div>
            <div className="responsive-app-scene__utilities">
              <span className="responsive-app-scene__utility" />
              <span className="responsive-app-scene__utility" />
            </div>
          </div>

          <div className="responsive-app-scene__interior">
            <div
              className="responsive-app-scene__navigation"
              data-responsive-region="nav"
              data-responsive-interior
            >
              {navigationItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`responsive-app-scene__nav-item${
                    index === 0 ? " responsive-app-scene__nav-item--active" : ""
                  }`}
                  data-responsive-nav-item={item.id}
                >
                  <span className="responsive-app-scene__nav-glyph" />
                  <span className="responsive-app-scene__nav-label">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="responsive-app-scene__main">
              <div
                className="responsive-app-scene__toolbar"
                data-responsive-region="toolbar"
                data-responsive-interior
              >
                <div className="responsive-app-scene__toolbar-heading">
                  <strong>Orders</strong>
                  <span
                    className="responsive-app-scene__action"
                    data-responsive-action
                  >
                    View order
                  </span>
                </div>
                <div className="responsive-app-scene__toolbar-controls">
                  <span className="responsive-app-scene__search">
                    Search orders
                  </span>
                  <span className="responsive-app-scene__filter">
                    All orders
                  </span>
                </div>
              </div>

              <div
                className="responsive-app-scene__orders"
                data-responsive-region="orders"
                data-responsive-interior
              >
                <div className="responsive-app-scene__order-head">
                  <span>Order</span>
                  <span>Customer</span>
                  <span>Status</span>
                  <span>Value</span>
                </div>

                <div className="responsive-app-scene__order-list">
                  {orderRows.map((order, index) => (
                    <div
                      key={order.id}
                      className={`responsive-app-scene__order-row${
                        index === 1
                          ? " responsive-app-scene__order-row--selected"
                          : ""
                      }`}
                      data-responsive-order-row={order.id}
                      {...(index === 1
                        ? { "data-responsive-selected-row": true }
                        : {})}
                    >
                      <span className="responsive-app-scene__order-primary">
                        <WireLine length={order.primary} />
                        <WireLine length={order.secondary} />
                      </span>
                      <span className="responsive-app-scene__order-customer">
                        <WireLine length={order.secondary} />
                      </span>
                      <span className="responsive-app-scene__order-status">
                        <WireLine length="short" />
                      </span>
                      <span className="responsive-app-scene__order-value">
                        <WireLine length="medium" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="responsive-app-scene__detail"
              data-responsive-region="detail"
              data-responsive-interior
            >
              <div className="responsive-app-scene__detail-heading">
                <strong>Selected order</strong>
                <span className="responsive-app-scene__completion">
                  Fulfilled
                </span>
              </div>
              <span
                className="responsive-app-scene__completion-rule"
                data-responsive-completion-rule
              />
              <div className="responsive-app-scene__detail-fields">
                {detailFields.map((field, index) => (
                  <div
                    key={field}
                    className="responsive-app-scene__detail-field"
                    data-responsive-detail-field={field.toLowerCase()}
                  >
                    <span>{field}</span>
                    <WireLine length={index % 2 === 0 ? "wide" : "medium"} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ResponsiveAppScene;
