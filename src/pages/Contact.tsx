import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { useSearchParams } from "react-router-dom";
import Icon from "../components/Icon";
import Seo from "../components/Seo";
import { services, site } from "../data/site";

type FormStatus = "idle" | "sending" | "success" | "error";
type FieldErrors = Partial<
  Record<"from_name" | "reply_to" | "message", string>
>;

const emailServiceId = import.meta.env?.VITE_EMAILJS_SERVICE_ID;
const emailTemplateId = import.meta.env?.VITE_EMAILJS_TEMPLATE_ID;
const emailPublicKey = import.meta.env?.VITE_EMAILJS_PUBLIC_KEY;

const Contact = () => {
  const [searchParams] = useSearchParams();
  const requestedService = searchParams.get("service") || "";
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const formRef = useRef<HTMLFormElement | null>(null);

  const validate = (formData: FormData) => {
    const nextErrors: FieldErrors = {};
    const name = String(formData.get("from_name") || "").trim();
    const email = String(formData.get("reply_to") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name) nextErrors.from_name = "Please enter your name.";
    if (!email) nextErrors.reply_to = "Please enter your work email.";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      nextErrors.reply_to = "Enter a valid email address.";
    if (!message) nextErrors.message = "Please add a short project summary.";
    else if (message.length < 20)
      nextErrors.message =
        "Add a little more detail so I can understand the request.";

    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current || status === "sending") return;

    const formData = new FormData(formRef.current);
    if (formData.get("website")) return;

    const nextErrors = validate(formData);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstInvalidName = Object.keys(nextErrors)[0];
      const firstInvalid = formRef.current.elements.namedItem(firstInvalidName);
      if (firstInvalid instanceof HTMLElement) firstInvalid.focus();
      return;
    }

    setStatus("sending");
    const data = Object.fromEntries(formData.entries());
    const projectMessage = [
      `Service: ${data.service || "Not specified"}`,
      `Company: ${data.company || "Not specified"}`,
      `Timeline: ${data.timeline || "Not specified"}`,
      `Budget: ${data.budget || "Not specified"}`,
      `Preferred contact: ${data.preferred_contact || "Email"}`,
      `Current situation: ${data.current_system || "Not specified"}`,
      "",
      String(data.message || ""),
    ].join("\n");

    try {
      if (!emailServiceId || !emailTemplateId || !emailPublicKey)
        throw new Error("Email service is not configured");
      await emailjs.send(
        emailServiceId,
        emailTemplateId,
        {
          ...data,
          message: projectMessage,
          to_email: site.email,
        },
        emailPublicKey,
      );
      formRef.current.reset();
      setErrors({});
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <Seo
        title="Contact"
        description="Tell Mark Judaya about an application, integration, automation, technical planning, or ongoing support need."
        canonical="/contact"
      />

      <header className="page-hero page-hero--compact section-shell">
        <p className="eyebrow">Contact</p>
        <h1>Tell me what needs to work better.</h1>
        <p>
          Share the current situation, the outcome you need, and any important
          constraints. You do not need to have the technical solution figured
          out yet.
        </p>
      </header>

      <section
        className="contact-layout section-shell"
        aria-labelledby="project-inquiry-title"
      >
        <div className="contact-form-wrap">
          <div className="contact-form-heading">
            <span>Project inquiry</span>
            <p>Required fields are marked with an asterisk.</p>
          </div>

          {status === "success" ? (
            <div className="form-success" role="status" tabIndex={-1}>
              <span>
                <Icon name="check" />
              </span>
              <h2>Thanks—your inquiry was sent.</h2>
              <p>
                I’ll review the details and reply with the next useful step.
              </p>
              <button
                type="button"
                className="button button--secondary"
                onClick={() => setStatus("idle")}
              >
                Send another inquiry
              </button>
            </div>
          ) : (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              noValidate
              aria-labelledby="project-inquiry-title"
              className="contact-form"
            >
              <h2 id="project-inquiry-title" className="sr-only">
                Project inquiry form
              </h2>
              <div className="honeypot" aria-hidden="true">
                <label>
                  Website
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <div className="form-grid">
                <div className="field">
                  <label htmlFor="from_name">
                    Name <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="from_name"
                    name="from_name"
                    autoComplete="name"
                    aria-invalid={Boolean(errors.from_name)}
                    aria-describedby={
                      errors.from_name ? "name-error" : undefined
                    }
                    onChange={() =>
                      setErrors((value) => ({ ...value, from_name: undefined }))
                    }
                  />
                  {errors.from_name && (
                    <p id="name-error" className="field-error">
                      {errors.from_name}
                    </p>
                  )}
                </div>
                <div className="field">
                  <label htmlFor="reply_to">
                    Work email <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="reply_to"
                    name="reply_to"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    aria-invalid={Boolean(errors.reply_to)}
                    aria-describedby={
                      errors.reply_to ? "email-error" : undefined
                    }
                    onChange={() =>
                      setErrors((value) => ({ ...value, reply_to: undefined }))
                    }
                  />
                  {errors.reply_to && (
                    <p id="email-error" className="field-error">
                      {errors.reply_to}
                    </p>
                  )}
                </div>
                <div className="field">
                  <label htmlFor="company">
                    Company or organization <span>Optional</span>
                  </label>
                  <input
                    id="company"
                    name="company"
                    autoComplete="organization"
                  />
                </div>
                <div className="field">
                  <label htmlFor="service">
                    Service needed <span>Optional</span>
                  </label>
                  <select
                    id="service"
                    name="service"
                    defaultValue={requestedService}
                  >
                    <option value="">Not sure yet</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.title}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field field--full">
                  <label htmlFor="message">
                    Project summary <span aria-hidden="true">*</span>
                  </label>
                  <p className="field-help" id="message-help">
                    What are you trying to build, connect, improve, or support?
                  </p>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={
                      errors.message
                        ? "message-help message-error"
                        : "message-help"
                    }
                    onChange={() =>
                      setErrors((value) => ({ ...value, message: undefined }))
                    }
                  />
                  {errors.message && (
                    <p id="message-error" className="field-error">
                      {errors.message}
                    </p>
                  )}
                </div>
                <div className="field field--full">
                  <label htmlFor="current_system">
                    Current system or situation <span>Optional</span>
                  </label>
                  <p className="field-help" id="system-help">
                    Mention any existing application, platform, workflow, or
                    technical constraint.
                  </p>
                  <textarea
                    id="current_system"
                    name="current_system"
                    rows={3}
                    aria-describedby="system-help"
                  />
                </div>
                <div className="field">
                  <label htmlFor="timeline">
                    Approximate timeline <span>Optional</span>
                  </label>
                  <select id="timeline" name="timeline" defaultValue="">
                    <option value="">Select a timeline</option>
                    <option>As soon as practical</option>
                    <option>Within 1–2 months</option>
                    <option>Within 3–6 months</option>
                    <option>Exploring options</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="budget">
                    Budget range <span>Optional</span>
                  </label>
                  <select id="budget" name="budget" defaultValue="">
                    <option value="">Prefer to discuss</option>
                    <option>Under US$1,000</option>
                    <option>US$1,000–5,000</option>
                    <option>US$5,000–10,000</option>
                    <option>US$10,000+</option>
                  </select>
                </div>
                <div className="field field--full">
                  <label htmlFor="preferred_contact">
                    Preferred contact method <span>Optional</span>
                  </label>
                  <select
                    id="preferred_contact"
                    name="preferred_contact"
                    defaultValue="Email"
                  >
                    <option>Email</option>
                    <option>Video call</option>
                    <option>LinkedIn</option>
                  </select>
                </div>
              </div>

              {status === "error" && (
                <div className="form-alert" role="alert">
                  <strong>The message could not be sent.</strong>
                  <span>
                    Please try again, email me directly, or book a call using
                    the options beside the form.
                  </span>
                </div>
              )}

              <div className="form-footer">
                <button
                  type="submit"
                  className="button button--primary"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Sending…" : "Send inquiry"}
                  {status !== "sending" && (
                    <Icon name="arrow-right" className="button__icon" />
                  )}
                </button>
                <p>
                  Your details are used only to respond to this inquiry and are
                  sent through EmailJS.
                </p>
              </div>
            </form>
          )}
        </div>

        <aside className="contact-aside">
          <div className="contact-option contact-option--primary">
            <span className="contact-option__icon">
              <Icon name="message" />
            </span>
            <p className="eyebrow eyebrow--light">Prefer a conversation?</p>
            <h2>Book a discovery call.</h2>
            <p>
              Use the calendar to choose an available time and give me a little
              context before we meet.
            </p>
            <a
              href={site.bookingUrl}
              target="_blank"
              rel="noreferrer"
              className="button button--light button--full"
            >
              Open booking calendar{" "}
              <Icon name="arrow-up-right" className="button__icon" />
            </a>
          </div>
          <div className="contact-option">
            <h2>Other ways to connect</h2>
            <a href={`mailto:${site.email}`}>
              <span>Email</span>
              <strong>{site.email}</strong>
            </a>
            <a href={site.socials.linkedin} target="_blank" rel="noreferrer">
              <span>Professional profile</span>
              <strong>
                LinkedIn <Icon name="arrow-up-right" />
              </strong>
            </a>
            <a href={site.socials.fiverr} target="_blank" rel="noreferrer">
              <span>Freelance services</span>
              <strong>
                Fiverr <Icon name="arrow-up-right" />
              </strong>
            </a>
          </div>
          <div className="contact-note">
            <strong>A useful first message includes</strong>
            <ul>
              <li>What is happening now</li>
              <li>What needs to change</li>
              <li>Who uses the system</li>
              <li>Any important deadline or constraint</li>
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
};

export default Contact;
