import { useState } from "react";
import { BookingSteps } from "./booking/BookingSteps";
import { ServiceSelection } from "./booking/ServiceSelection";
import { BarberSelection } from "./booking/BarberSelection";
import { DateTimeSelection } from "./booking/DateTimeSelection";
import { ContactForm } from "./booking/ContactForm";
import { BookingSummary } from "./booking/BookingSummary";
import { SuccessPage } from "./booking/SuccessPage";
import { BookingHeader } from "./booking/BookingHeader";
import { Card } from "./ui/card";

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export interface Option {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export interface Barber {
  id: string;
  name: string;
  avatar: string;
  specialties: string[];
}

export interface BookingData {
  service?: Service;
  options: Option[];
  barber?: Barber;
  date?: Date;
  time?: string;
  phone: string;
  email?: string;
  name?: string;
  totalPrice: number;
}

const BookingApp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    options: [],
    phone: "",
    totalPrice: 0,
  });

  const updateBookingData = (updates: Partial<BookingData>) => {
    setBookingData(prev => {
      const newData = { ...prev, ...updates };
      
      // Recalculate total price
      let totalPrice = newData.service?.price || 0;
      totalPrice += newData.options.reduce((sum, option) => sum + option.price, 0);
      
      return { ...newData, totalPrice };
    });
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetBooking = () => {
    setCurrentStep(1);
    setBookingData({
      options: [],
      phone: "",
      totalPrice: 0,
    });
  };

  if (currentStep === 6) {
    return <SuccessPage onNewBooking={resetBooking} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-cream to-background">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-4xl">
        <BookingHeader />
        
        <Card className="mt-4 sm:mt-8 p-3 sm:p-6 shadow-soft">
          <BookingSteps currentStep={currentStep} />
          
          <div className="mt-4 sm:mt-8">
            {currentStep === 1 && (
              <ServiceSelection
                bookingData={bookingData}
                updateBookingData={updateBookingData}
                onNext={nextStep}
              />
            )}
            
            {currentStep === 2 && (
              <BarberSelection
                bookingData={bookingData}
                updateBookingData={updateBookingData}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}
            
            {currentStep === 3 && (
              <DateTimeSelection
                bookingData={bookingData}
                updateBookingData={updateBookingData}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}
            
            {currentStep === 4 && (
              <ContactForm
                bookingData={bookingData}
                updateBookingData={updateBookingData}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}
            
            {currentStep === 5 && (
              <BookingSummary
                bookingData={bookingData}
                onConfirm={nextStep}
                onPrev={prevStep}
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BookingApp;