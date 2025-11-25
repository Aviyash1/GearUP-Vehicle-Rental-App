import React from "react";
import "./terms.css";

const TermsAndConditions = () => {
  return (
    <div className="tc-wrapper">
      <header className="tc-header">
        <h1 className="tc-title">Terms & Conditions</h1>
        <p className="tc-subtitle">Please read these terms carefully.</p>
      </header>

      <section className="tc-content">

        <h2>1. Acceptance of Terms</h2>
        <p>
          By using the GearUP, you agree to these Terms &
          Conditions. If you do not agree, you may not use the platform.
        </p>

        <h2>2. About GearUP</h2>
        <p>
          GearUP is a peer-to-peer marketplace that connects car owners with renters.
          GearUP does not own any vehicles; all vehicles are owned and listed by
          independent vehicle owners.
        </p>

        <h2>3. Eligibility</h2>
        <ul>
          <li>You must be at least 18 years old.</li>
          <li>You must have a valid driving license.</li>
          <li>You must provide accurate information during registration.</li>
        </ul>

        <h2>4. Vehicle Usage Rules</h2>
        <p>Renters must use vehicles responsibly. The following are strictly prohibited:</p>
        <ul>
          <li>Off-road driving</li>
          <li>Speeding or racing</li>
          <li>Transporting illegal goods</li>
          <li>Driving under the influence of alcohol or drugs</li>
          <li>Allowing unauthorized drivers</li>
        </ul>

        <h2>5.Payments</h2>
        <p>
          Renters authorize GearUP to charge rental fees, late fees, fines, damage
          charges, and any additional applicable costs. GearUP earns a commission
          from each booking.
        </p>

        <h2>6. Damage & Accidents</h2>
        <p>
          Renters are fully responsible for any damage, theft, or accidents unless
          covered by optional insurance.
        </p>

        <h2>7. Late Returns</h2>
        <p>
          Late returns may result in additional charges. Extensions depend on owner
          approval and vehicle availability.
        </p>

        <h2>8. Owner Responsibilities</h2>
        <ul>
          <li>Provide accurate vehicle information</li>
          <li>Ensure the vehicle is road-worthy</li>
          <li>Maintain proper insurance where required</li>
        </ul>

        <h2>9. Account Suspension</h2>
        <p>
          GearUP may suspend or terminate accounts for fraud, abuse, or violations
          of platform policies.
        </p>

        <h2>10. Privacy Policy</h2>
        <p>
          By using GearUP, you consent to the collection and processing of your data
          as described in our Privacy Policy.
        </p>

        <h2>11. Limitation of Liability</h2>
        <p>
          GearUP is not responsible for indirect damages, personal loss, or disputes
          between renters and owners. GearUP’s total liability is limited to the
          service fee paid.
        </p>

        <h2>12. Termination</h2>
        <p>
          GearUP may terminate or suspend access to the platform for any violations
          of these Terms.
        </p>

        <h2>13. Contact Information</h2>
        <p>
          For support, email:{" "}
          <a href="mailto:support@gearup.com">support@gearup.com</a>
        </p>

      </section>
    </div>
  );
};

export default TermsAndConditions;
