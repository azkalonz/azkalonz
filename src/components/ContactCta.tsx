import { Link } from "react-router-dom";
import Icon from "./Icon";

type ContactCtaProps = {
  eyebrow?: string;
  title?: string;
  copy?: string;
};

const ContactCta = ({
  eyebrow = "Start a conversation",
  title = "Have a system to build, connect, improve, or support?",
  copy = "Share what is happening now and what you need to work better. I’ll help you identify a practical next step.",
}: ContactCtaProps) => (
  <section className="cta-band" aria-labelledby="contact-cta-title">
    <div>
      <p className="eyebrow eyebrow--light">{eyebrow}</p>
      <h2 id="contact-cta-title" className="cta-band__title">
        {title}
      </h2>
      <p className="cta-band__copy">{copy}</p>
    </div>
    <Link to="/contact" className="button button--light">
      Tell me about your project
      <Icon name="arrow-right" className="button__icon" />
    </Link>
  </section>
);

export default ContactCta;
