"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQAccordion() {
  const faqs = [
    {
      question: "What are the offerings of the IT Jobs Factory?",
      answer:
        "IT Jobs Factory offers comprehensive, industry-aligned training programs that equip candidates with the technical skills and professional expertise required to succeed in today’s competitive IT landscape The technical skills include Java, Python, Full Stack Development, DevOps, Cloud Computing, Automation, Production Support, and more, tailored to meet the demands of the evolving IT industry.",
    },
    {
      question: "What will be the mode of conduction of classes?",
      answer:
        "We offer both online and offline training sessions: Online: Conducted via any online platform. Our classes are conducted by global trainers, with some delivering sessions from the USA, France, and Australia. These trainers are seasoned industry experts with decades of professional experience, ensuring that students receive world-class, industry-relevant training.Offline: Available at our Pune and Sagar Branch, Makroniya Center.",
    },
    {
      question: "What is the class schedule for working professionals?",
      answer:
        "We offer flexible class timings to cater to both freshers and working professionals, with options for weekday and weekend sessions. Our weekend classes are specially designed to accommodate the busy schedules of professionals, ensuring everyone can enhance their skills at a convenient pace.",
    },
    {
      question:
        "I have work experience in a non-IT field. Can I switch to an IT career?",
      answer:
        "Yes, individuals from non-IT backgrounds can transition to IT roles by acquiring the necessary skills through our training programs. Our 100% job assistance ensures a smooth switch to the IT industry",
    },
    {
      question: "What kind of support will I have during the course?",
      answer:
        "We have a dedicated support team to assist you throughout the program. You can reach us via email at itjobsfactory@gmail.com or support@itjobsfactory.com or call us at +91 9425645442 Or 07582360093.",
    },
    {
      question: "How long does it take to complete the course?",
      answer:
        "The duration of the course depends on the program you choose. Typically, courses range from 3 months to 12 months, depending on the depth of the curriculum and individual progress.",
    },
    {
      question: "Will I get practical experience during the training?",
      answer:
        "Yes, our training emphasizes hands-on experience through live projects, case studies ensuring you are job-ready by the time of completion.",
    },
    {
      question: "Is there any interview preparation included in the course?",
      answer:
        "Absolutely! We provide thorough interview preparation, including mock interviews, technical assessments, and resume-building workshops to help you stand out in job interviews.",
    },
    {
      question:
        "What kind of flexibility is provided to working professionals for the sessions?",
      answer:
        "We offer weekend sessions specifically tailored for working professionals. These sessions are designed to accommodate their busy schedules while delivering the same comprehensive training as the regular weekday batches.",
    },
  ];

  return (
    <section
      className="py-16 px-4 sm:px-6 text-white bg-cyan-950"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-10 text-white">
          <span className="text-cyan-300 underline">Frequently</span> Asked
          Questions
        </h2>
        <Accordion type="multiple" className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-white text-base sm:text-lg font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-lg space-x-2 text-cyan-200">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
