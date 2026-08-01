import { Link } from "react-router-dom";
import Icon from "./Icon";

type ContactCtaProps = {
  title?: string;
  copy?: string;
};

const ContactCta = ({
  title = "Have a software project in mind?",
  copy = "Tell me what you’re working with and what needs to change. I’ll reply with a clear next step.",
}: ContactCtaProps) => (
  <section className="cta-field" aria-labelledby="contact-cta-title">
    <div>
      <h2 id="contact-cta-title">{title}</h2>
    </div>
    <div>
      <p>{copy}</p>
      <Link to="/contact" className="button button--primary">
        Tell me about your project <Icon name="arrow-right" />
      </Link>
    </div>
  </section>
);

export default ContactCta;
