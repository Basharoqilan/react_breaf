import React, { useState } from 'react';
import { db } from '../firebase'; // Import Firestore instance
import { collection, addDoc } from 'firebase/firestore'; // For saving data
import './SubscriptionModal.css';

const SubscriptionModal = ({ course, user, onClose }) => {
  const [creditCard, setCreditCard] = useState({
    card_holder_name: '',
    card_number: '',
    cvv: '',
    expiry_date: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCreditCard({ ...creditCard, [name]: value });
  };

  const validateCreditCardInfo = () => {
    const { card_holder_name, card_number, cvv, expiry_date } = creditCard;

    // Card Holder Name Validation: Only alphabets and spaces, minimum 2 characters
    const nameRegex = /^[A-Za-z\s]{2,}$/;
    if (!nameRegex.test(card_holder_name)) {
      alert("Card Holder Name must be at least 2 characters long and contain only letters and spaces.");
      return false;
    }

    // Card Number Validation: Should be 16 digits
    const cardNumberRegex = /^\d{16}$/;
    if (!cardNumberRegex.test(card_number)) {
      alert("Card Number must be exactly 16 digits.");
      return false;
    }

    // CVV Validation: Should be 3 digits
    const cvvRegex = /^\d{3}$/;
    if (!cvvRegex.test(cvv)) {
      alert("CVV must be exactly 3 digits.");
      return false;
    }

    // Expiry Date Validation: MM/YYYY format and future date
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{4}$/;
    if (!expiryDateRegex.test(expiry_date)) {
      alert("Expiry Date must be in MM/YYYY format.");
      return false;
    }

    // Check if the expiry date is in the future
    const [month, year] = expiry_date.split('/');
    const expiryDate = new Date(`${year}-${month}-01`);
    const currentDate = new Date();
    if (expiryDate <= currentDate) {
      alert("Expiry Date must be in the future.");
      return false;
    }

    return true;
  };

  const handleSaveCreditCard = async () => {
    if (!validateCreditCardInfo()) {
      return; // If validation fails, stop execution
    }

    try {
      // Check if course.id exists
      console.log("Course object:", course);
      if (!course.id) {
        console.error("Course ID is missing or undefined.");
        alert("Course ID is missing!");
        return;
      }

      // Add credit card info to Firebase
      const creditCardData = {
        ...creditCard,
        courseID: course.id,
        user_name: user.name,
        user_id: user.userid,
        status: 'pending',
        created_at: new Date()
      };

      console.log("Credit Card Data Payload:", creditCardData);
      await addDoc(collection(db, 'credit_card'), creditCardData);

      // Create a subscription in the `subscriptions` collection
      const subscriptionData = {
        courseID: course.id,
        userID: user.userid,
        status: 'pending',
        subscription_date: new Date()
      };

      console.log("Subscription Data Payload:", subscriptionData);
      await addDoc(collection(db, 'subscriptions'), subscriptionData);

      alert('Credit Card Info and Subscription Saved Successfully!');
    } catch (error) {
      console.error('Error saving credit card info or subscription:', error.message);
      alert('Error saving data: ' + error.message);
    }

    onClose(); // Close the modal after saving
  };

  if (!course || !user) return null; // Don't show the modal if data is missing

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose} style={{ color: "black" }}>X</button>
        <h2>Subscription Details</h2>
        <p><strong>Course Name:</strong> {course.course_name}</p>
        <p><strong>Course Duration:</strong> {course.course_duration} days</p>
        <p><strong>Total Cost:</strong> {course.total_cost} $</p>

        <h3>Enter Credit Card Information</h3>
        <div className="credit-card-inputs">
          <input
            type="text"
            name="card_holder_name"
            placeholder="Card Holder Name"
            value={creditCard.card_holder_name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="card_number"
            placeholder="Card Number"
            value={creditCard.card_number}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="cvv"
            placeholder="CVV"
            value={creditCard.cvv}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="expiry_date"
            placeholder="Expiry Date (MM/YYYY)"
            value={creditCard.expiry_date}
            onChange={handleInputChange}
          />
        </div>

        <button className="save-button" onClick={handleSaveCreditCard} style={{ backgroundColor : "#6e8efb" }}>Subscription</button>
      </div>
    </div>
  );
};

export default SubscriptionModal;
