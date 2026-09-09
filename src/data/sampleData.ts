import { Conversation, Message } from '../types';

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-101',
    customer_name: 'Elena Rostova',
    customer_email: 'elena.rostova@wellnesscenter.com',
    status: 'open',
    last_message: 'Does the Platinum Mat 7224 support custom PEMF frequency programs between 1-30 Hz?',
    last_message_at: new Date(Date.now() - 1000 * 60 * 4).toISOString(), // 4m ago
    created_at: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    category: 'Product Specifications',
    tags: ['platinum-mat', 'pemf', 'infrared'],
    messages_count: 6,
    unread: true,
  },
  {
    id: 'conv-102',
    customer_name: 'Marcus Vance',
    customer_email: 'm.vance@chirohealth.net',
    status: 'pending',
    last_message: 'The reset procedure for the LED controller worked! Heat is now regulating accurately.',
    last_message_at: new Date(Date.now() - 1000 * 60 * 28).toISOString(), // 28m ago
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
    category: 'Technical Support',
    tags: ['controller', 'temperature', 'troubleshooting'],
    messages_count: 5,
    unread: false,
  },
  {
    id: 'conv-103',
    customer_name: 'Sophie Laurent',
    customer_email: 'sophie.laurent@spasolutions.fr',
    status: 'resolved',
    last_message: 'Your replacement waterproof protective cover for Order #HL-9821 has shipped via FedEx tracking #9400111899.',
    last_message_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3h ago
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    category: 'Shipping & Orders',
    tags: ['replacement', 'warranty', 'fedex'],
    messages_count: 7,
    unread: false,
  },
  {
    id: 'conv-104',
    customer_name: 'Devon Miller',
    customer_email: 'dmiller@holisticclinic.org',
    status: 'open',
    last_message: 'Can I use the Far Infrared Amethyst Mat while having a knee joint replacement?',
    last_message_at: new Date(Date.now() - 1000 * 60 * 42).toISOString(), // 42m ago
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    category: 'Safety & Contraindications',
    tags: ['amethyst-mat', 'contraindications', 'safety'],
    messages_count: 4,
    unread: true,
  },
  {
    id: 'conv-105',
    customer_name: 'Aisha Patel',
    customer_email: 'aisha@zenithwellness.co',
    status: 'resolved',
    last_message: 'The 5-year extended warranty certificate has been registered to serial number HL-MAT-78401.',
    last_message_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8h ago
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    category: 'Warranty & Care',
    tags: ['warranty', 'registration', 'serial-number'],
    messages_count: 4,
    unread: false,
  },
  {
    id: 'conv-106',
    customer_name: 'Carlos Mendez',
    customer_email: 'carlos.m@recoverylab.io',
    status: 'pending',
    last_message: 'What is the maximum continuous operation timer recommendation for photon light therapy?',
    last_message_at: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(), // 15h ago
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(),
    category: 'Product Question',
    tags: ['photon-light', 'red-light', 'protocol'],
    messages_count: 3,
    unread: false,
  }
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  'conv-101': [
    {
      id: 'msg-101-1',
      conversation_id: 'conv-101',
      sender_type: 'customer',
      content: 'Hi there! We are currently evaluating upgrading our clinic with multiple HealthyLine Platinum Mat 7224 units. I wanted to verify the exact PEMF capabilities before placing our order.',
      created_at: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
    },
    {
      id: 'msg-101-2',
      conversation_id: 'conv-101',
      sender_type: 'ai',
      model_name: 'HealthyLine AI Support',
      content: "Hello Elena! 👋 Welcome to HealthyLine Customer Support. I'd be delighted to assist you with the Platinum Mat 7224 specifications.\n\nThe Platinum Series is our premier line combining 5 advanced wellness therapies: **Pulsed Electromagnetic Field (PEMF)**, **Far Infrared Rays (FIR)**, **Negative Ion Therapy**, **Photon Red Light (660nm)**, and **Natural Gemstone Therapy** (Amethyst, Tourmaline, Jade, Obsidian, and Quartz).\n\nWhat specific PEMF requirements would you like to verify for your clinic?",
      created_at: new Date(Date.now() - 1000 * 60 * 64).toISOString(),
    },
    {
      id: 'msg-101-3',
      conversation_id: 'conv-101',
      sender_type: 'customer',
      content: 'Does the Platinum Mat 7224 support custom PEMF frequency programs between 1-30 Hz, and can we select specific waveforms like sine or square wave?',
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: 'msg-101-4',
      conversation_id: 'conv-101',
      sender_type: 'ai',
      model_name: 'HealthyLine AI Support',
      content: `Yes, absolutely! The Platinum Series controller provides full digital PEMF customization:

* **Frequency Range:** Fully adjustable from **1 Hz to 25 Hz** in 1 Hz increments, plus preset Schumann Resonances (7.83 Hz).
* **Waveforms:** Switchable between **Sine wave** (gentle, relaxing biorhythms) and **Square wave** (rapid rise, energizing tissue stimulation).
* **Pulse Duration & Intensity:** Adjustable intensity up to 3 Gauss (300 microtesla) with pulsed cycles (e.g., 20 minutes on, 100 minutes off for sleep protocols).
* **Independent Therapy Controls:** You can run PEMF independently from Far Infrared heat or Photon light therapy depending on client tolerance.

Would you like me to send you the official clinical protocol guide or connect you with our commercial accounts manager for bulk clinic pricing?`,
      created_at: new Date(Date.now() - 1000 * 60 * 29).toISOString(),
    },
    {
      id: 'msg-101-5',
      conversation_id: 'conv-101',
      sender_type: 'customer',
      content: 'Does the Platinum Mat 7224 support custom PEMF frequency programs between 1-30 Hz?',
      created_at: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    },
    {
      id: 'msg-101-6',
      conversation_id: 'conv-101',
      sender_type: 'ai',
      model_name: 'HealthyLine AI Support',
      content: "Yes, it does! The digital controller allows custom selection from 1 to 25 Hz, as well as preset Schumann resonance frequencies. If you need custom commercial quotes for multiple mats, I can flag this conversation directly to our commercial sales specialist.",
      created_at: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    }
  ],

  'conv-102': [
    {
      id: 'msg-102-1',
      conversation_id: 'conv-102',
      sender_type: 'customer',
      content: "Hello, my HealthyLine controller is displaying an error code 'E1' and the mat is not heating up above room temperature. Is there a reset sequence?",
      created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    },
    {
      id: 'msg-102-2',
      conversation_id: 'conv-102',
      sender_type: 'ai',
      model_name: 'HealthyLine AI Support',
      content: `Hi Marcus! The 'E1' error indicates a temporary connection disconnect between the controller connector and the mat's internal thermal sensor pins.

### Recommended Quick Reset:
1. Turn off the power switch on the back of the controller and unplug it from the wall outlet.
2. Firmly unplug the multi-pin connector connecting the controller cord directly into the mat port.
3. Check the internal pins to make sure there is no dust, then re-insert the connector firmly until you hear/feel a secure lock.
4. Plug the controller directly into a grounded wall outlet (avoid ungrounded power strips).
5. Turn the power switch back on and set temperature to 45°C (113°F).`,
      created_at: new Date(Date.now() - 1000 * 60 * 178).toISOString(),
    },
    {
      id: 'msg-102-3',
      conversation_id: 'conv-102',
      sender_type: 'customer',
      content: 'The reset procedure for the LED controller worked! Heat is now regulating accurately.',
      created_at: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
    },
    {
      id: 'msg-102-4',
      conversation_id: 'conv-102',
      sender_type: 'ai',
      model_name: 'HealthyLine AI Support',
      content: "Wonderful! We are so glad to hear your HealthyLine mat is heating properly again. Don't hesitate to reach back out if you ever need additional support or replacement accessories.",
      created_at: new Date(Date.now() - 1000 * 60 * 27).toISOString(),
    }
  ],

  'conv-103': [
    {
      id: 'msg-103-1',
      conversation_id: 'conv-103',
      sender_type: 'customer',
      content: "Hi, I ordered a HealthyLine TAO-Mat Full Pro 7224 and need to check on my warranty replacement cover order #HL-9821.",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: 'msg-103-2',
      conversation_id: 'conv-103',
      sender_type: 'ai',
      model_name: 'HealthyLine AI Support',
      content: "Hello Sophie! Let me check the fulfillment status for warranty order #HL-9821 right away.",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 5 + 30000).toISOString(),
    },
    {
      id: 'msg-103-3',
      conversation_id: 'conv-103',
      sender_type: 'ai',
      model_name: 'HealthyLine AI Support',
      content: "Your replacement waterproof 3D mesh protective cover was processed under your HealthyLine complimentary warranty and dispatched from our New York fulfillment center today.",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    },
    {
      id: 'msg-103-4',
      conversation_id: 'conv-103',
      sender_type: 'customer',
      content: "Thank you! Do you have the tracking number handy?",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 3 - 60000).toISOString(),
    },
    {
      id: 'msg-103-5',
      conversation_id: 'conv-103',
      sender_type: 'ai',
      model_name: 'HealthyLine AI Support',
      content: 'Your replacement waterproof protective cover for Order #HL-9821 has shipped via FedEx tracking #9400111899. Estimated delivery is in 2 business days.',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    }
  ],

  'conv-104': [
    {
      id: 'msg-104-1',
      conversation_id: 'conv-104',
      sender_type: 'customer',
      content: 'Can I use the Far Infrared Amethyst Mat while having a knee joint replacement?',
      created_at: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    },
    {
      id: 'msg-104-2',
      conversation_id: 'conv-104',
      sender_type: 'ai',
      model_name: 'HealthyLine AI Support',
      content: `Hello Devon, thank you for checking with us. Safety is our top priority at HealthyLine.

### Important Medical Contraindication Guidelines:
* **Metal or Titanium Implants:** Far infrared deep thermal heat can be absorbed differently by surgical hardware (plates, artificial joints). While low levels of heat (up to 40°C / 104°F) are commonly tolerated, high thermal settings directly over implants should be avoided without physician sign-off.
* **PEMF Caution:** While titanium/surgical grade metals are non-ferromagnetic, we advise keeping PEMF intensity low and consulting your orthopedic surgeon prior to applying magnetic fields directly over joint replacements.
* **Negative Ions & Gemstones:** Non-thermal gemstone sessions and negative ion therapy have no hardware contraindications.

We always recommend discussing the specific thermal and PEMF protocols with your physical therapist or primary care physician.`,
      created_at: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    }
  ],

  'conv-105': [
    {
      id: 'msg-105-1',
      conversation_id: 'conv-105',
      sender_type: 'customer',
      content: 'I recently bought an Inframat Pro and wanted to verify that my warranty registration was received.',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    },
    {
      id: 'msg-105-2',
      conversation_id: 'conv-105',
      sender_type: 'ai',
      model_name: 'HealthyLine AI Support',
      content: 'Hi Aisha! I would be glad to check your registration record. Could you confirm the serial number located on the tag on the underside of your mat?',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 11).toISOString(),
    },
    {
      id: 'msg-105-3',
      conversation_id: 'conv-105',
      sender_type: 'customer',
      content: 'The serial number on the tag is HL-MAT-78401.',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
    },
    {
      id: 'msg-105-4',
      conversation_id: 'conv-105',
      sender_type: 'ai',
      model_name: 'HealthyLine AI Support',
      content: 'The 5-year extended warranty certificate has been registered to serial number HL-MAT-78401. Your mat is fully protected against electronic and thermal defects.',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    }
  ],

  'conv-106': [
    {
      id: 'msg-106-1',
      conversation_id: 'conv-106',
      sender_type: 'customer',
      content: 'What is the maximum continuous operation timer recommendation for photon light therapy?',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(),
    },
    {
      id: 'msg-106-2',
      conversation_id: 'conv-106',
      sender_type: 'ai',
      model_name: 'HealthyLine AI Support',
      content: 'Hello Carlos! For HealthyLine mats with **660nm Red Photon Light Therapy**, the recommended session time is **20 to 30 minutes** once or twice per day. The controller auto-shuts off the photon lights after 30 minutes to preserve LED diode longevity.',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    }
  ]
};
