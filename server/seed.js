const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const ProviderProfile = require('./models/ProviderProfile');
const ServiceCategory = require('./models/ServiceCategory');
const ServiceRequest = require('./models/ServiceRequest');
const Quote = require('./models/Quote');
const Booking = require('./models/Booking');
const Invoice = require('./models/Invoice');
const Review = require('./models/Review');
const Dispute = require('./models/Dispute');
const Notification = require('./models/Notification');
const AuditLog = require('./models/AuditLog');

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/careconnect';
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing database collections...');
    await User.deleteMany({});
    await ProviderProfile.deleteMany({});
    await ServiceCategory.deleteMany({});
    await ServiceRequest.deleteMany({});
    await Quote.deleteMany({});
    await Booking.deleteMany({});
    await Invoice.deleteMany({});
    await Review.deleteMany({});
    await Dispute.deleteMany({});
    await Notification.deleteMany({});
    await AuditLog.deleteMany({});

    console.log('Seeding Service Categories for Fixora (AC & TV Specialist)...');
    const categoriesData = [
      {
        name: 'AC Services',
        slug: 'ac-services',
        description: 'AC servicing, foam jet cleaning, gas refill, installation & repair diagnostics.',
        icon: 'Wind',
        basePrice: 299,
        popular: true,
        skillsRequired: ['AC Repair', 'HVAC Technician', 'Foam Jet Cleaning', 'Refrigerant Gas Charging'],
      },
      {
        name: 'TV Services',
        slug: 'tv-services',
        description: 'TV check-up, wall mounting, power supply repair & panel diagnostics.',
        icon: 'Tv',
        basePrice: 249,
        popular: true,
        skillsRequired: ['TV Technician', 'Wall Mounting', 'Panel Diagnostics', 'Smart TV Setup'],
      },
      {
        name: 'AC Check-up',
        slug: 'ac-checkup',
        description: 'Complete inspection to identify cooling and performance issues.',
        icon: 'Search',
        basePrice: 299,
        popular: true,
        skillsRequired: ['AC Diagnostics'],
      },
      {
        name: 'AC Deep Cleaning',
        slug: 'ac-deep-cleaning',
        description: 'Deep foam & jet cleaning of filters, coils and indoor unit.',
        icon: 'Sparkles',
        basePrice: 599,
        popular: true,
        skillsRequired: ['Foam Jet Cleaning'],
      },
      {
        name: 'AC Gas Refill',
        slug: 'ac-gas-refill',
        description: 'Refrigerant pressure inspection and gas refill based on requirement.',
        icon: 'Gauge',
        basePrice: 299,
        popular: true,
        skillsRequired: ['Refrigerant Gas Charging'],
      },
      {
        name: 'AC Installation',
        slug: 'ac-installation',
        description: 'Professional split/window AC installation with vacuum testing.',
        icon: 'Wrench',
        basePrice: 1099,
        popular: true,
        skillsRequired: ['AC Installation'],
      },
      {
        name: 'TV Check-up',
        slug: 'tv-checkup',
        description: 'Diagnostic inspection for picture, sound and power issues.',
        icon: 'Tv',
        basePrice: 249,
        popular: true,
        skillsRequired: ['TV Technician'],
      },
      {
        name: 'TV Wall Mounting',
        slug: 'tv-wall-mounting',
        description: 'Heavy-duty wall bracket mounting for LED/OLED/QLED TVs.',
        icon: 'Maximize',
        basePrice: 699,
        popular: true,
        skillsRequired: ['Wall Mounting'],
      },
    ];

    const createdCategories = await ServiceCategory.insertMany(categoriesData);

    console.log('Seeding Users (Admins, Ops Managers, Support Agents, Customers, Providers)...');
    const commonPassword = await bcrypt.hash('password123', 10);

    // 2 Platform Admins
    const admins = await User.insertMany([
      {
        name: 'Vikramaditya Sharma',
        email: 'admin@careconnect.com',
        password: commonPassword,
        phone: '9900000001',
        role: 'ADMIN',
        location: { address: 'Admin HQ, MG Road', city: 'Bangalore' },
      },
      {
        name: 'Ananya Roy',
        email: 'ananya.admin@careconnect.com',
        password: commonPassword,
        phone: '9900000002',
        role: 'ADMIN',
        location: { address: 'Admin HQ, MG Road', city: 'Bangalore' },
      },
    ]);

    // 2 Operations Managers
    const opsManagers = await User.insertMany([
      {
        name: 'Rajesh Nair',
        email: 'ops@careconnect.com',
        password: commonPassword,
        phone: '9900000003',
        role: 'OPERATIONS_MANAGER',
        location: { address: 'Ops Hub, Indiranagar', city: 'Bangalore' },
      },
      {
        name: 'Pooja Verma',
        email: 'pooja.ops@careconnect.com',
        password: commonPassword,
        phone: '9900000004',
        role: 'OPERATIONS_MANAGER',
        location: { address: 'Ops Hub, HSR Layout', city: 'Bangalore' },
      },
    ]);

    // 3 Support Agents
    const supportAgents = await User.insertMany([
      {
        name: 'Suresh Menon',
        email: 'support@careconnect.com',
        password: commonPassword,
        phone: '9900000005',
        role: 'SUPPORT_AGENT',
      },
      {
        name: 'Kavita Joshi',
        email: 'kavita.support@careconnect.com',
        password: commonPassword,
        phone: '9900000006',
        role: 'SUPPORT_AGENT',
      },
      {
        name: 'Amitabh Sen',
        email: 'amitabh.support@careconnect.com',
        password: commonPassword,
        phone: '9900000007',
        role: 'SUPPORT_AGENT',
      },
    ]);

    // 10 Customers
    const customerNames = [
      'Pavani Reddy',
      'Arjun Kapoor',
      'Sneha Kulkarni',
      'Rohan Deshmukh',
      'Priya Mehta',
      'Karan Singhania',
      'Meera Iyer',
      'Varun Gupta',
      'Divya Pillai',
      'Nikhil Banerjee',
    ];

    const customerDocs = customerNames.map((name, idx) => ({
      name,
      email: idx === 0 ? 'customer@careconnect.com' : `customer${idx + 1}@careconnect.com`,
      password: commonPassword,
      phone: `984500000${idx}`,
      role: 'CUSTOMER',
      location: {
        address: `${100 + idx * 12}, 4th Block, Indiranagar`,
        city: 'Bangalore',
        zipCode: '560038',
      },
    }));

    const customers = await User.insertMany(customerDocs);

    // 15 Providers
    const providerData = [
      {
        name: 'Rahul Kumar',
        email: 'rahul.provider@careconnect.com',
        skills: ['HVAC Technician', 'AC Diagnostics', 'Cooling System Repair', 'Refrigerant Gas Charging'],
        exp: 8,
        rating: 4.9,
        reviews: 324,
        rate: 499,
        status: 'VERIFIED',
      },
      {
        name: 'Sunil Rao',
        email: 'sunil.provider@careconnect.com',
        skills: ['Licensed Electrician', 'Circuit Repair', 'House Rewiring', 'Switchboard Repair'],
        exp: 6,
        rating: 4.8,
        reviews: 189,
        rate: 399,
        status: 'VERIFIED',
      },
      {
        name: 'Mohammed Ali',
        email: 'ali.provider@careconnect.com',
        skills: ['Pipe Fitting', 'Leak Repair', 'Geyser Installation', 'Drain Unclogging'],
        exp: 10,
        rating: 4.9,
        reviews: 412,
        rate: 349,
        status: 'VERIFIED',
      },
      {
        name: 'Deepak Patil',
        email: 'deepak.provider@careconnect.com',
        skills: ['Appliance Technician', 'Motor Repair', 'PCB Board Repair'],
        exp: 5,
        rating: 4.7,
        reviews: 142,
        rate: 449,
        status: 'VERIFIED',
      },
      {
        name: 'Lakshmi Devi',
        email: 'lakshmi.provider@careconnect.com',
        skills: ['Deep Home Cleaning', 'Sofa & Upholstery Shampooing', 'Sanitization Specialist'],
        exp: 7,
        rating: 4.8,
        reviews: 260,
        rate: 899,
        status: 'VERIFIED',
      },
      {
        name: 'Ganesh Acharya',
        email: 'ganesh.provider@careconnect.com',
        skills: ['Custom Carpentry', 'Door Lock Installation', 'Furniture Assembly'],
        exp: 9,
        rating: 4.8,
        reviews: 195,
        rate: 349,
        status: 'VERIFIED',
      },
      {
        name: 'Vijay Gowda',
        email: 'vijay.provider@careconnect.com',
        skills: ['Interior Painting', 'Exterior Painting', 'Wall Putty & Primer'],
        exp: 11,
        rating: 4.9,
        reviews: 310,
        rate: 1299,
        status: 'VERIFIED',
      },
      {
        name: 'Suresh Prabhu',
        email: 'suresh.provider@careconnect.com',
        skills: ['HVAC Technician', 'Filter Cleaning', 'AC Diagnostics'],
        exp: 4,
        rating: 4.6,
        reviews: 88,
        rate: 449,
        status: 'VERIFIED',
      },
      {
        name: 'Ramesh Reddy',
        email: 'ramesh.provider@careconnect.com',
        skills: ['Pipe Fitting', 'Sanitaryware Installation', 'Geyser Installation'],
        exp: 7,
        rating: 4.7,
        reviews: 165,
        rate: 399,
        status: 'VERIFIED',
      },
      {
        name: 'Manjunath B',
        email: 'manju.provider@careconnect.com',
        skills: ['Licensed Electrician', 'Switchboard Repair', 'Appliance Power Check'],
        exp: 5,
        rating: 4.8,
        reviews: 130,
        rate: 399,
        status: 'VERIFIED',
      },
      {
        name: 'Santosh Hegde',
        email: 'santosh.provider@careconnect.com',
        skills: ['Deep Home Cleaning', 'Kitchen Degreasing'],
        exp: 3,
        rating: 4.5,
        reviews: 64,
        rate: 799,
        status: 'PENDING',
      },
      {
        name: 'Ketan Solanki',
        email: 'ketan.provider@careconnect.com',
        skills: ['Appliance Technician', 'Thermostat Calibration'],
        exp: 2,
        rating: 4.4,
        reviews: 40,
        rate: 399,
        status: 'PENDING',
      },
      {
        name: 'Pradeep Jha',
        email: 'pradeep.provider@careconnect.com',
        skills: ['Custom Carpentry', 'Cabinet Hinge Repair'],
        exp: 4,
        rating: 4.6,
        reviews: 72,
        rate: 299,
        status: 'VERIFIED',
      },
      {
        name: 'Anil Kumar',
        email: 'anil.provider@careconnect.com',
        skills: ['Interior Painting', 'Waterproofing Specialist'],
        exp: 6,
        rating: 4.7,
        reviews: 110,
        rate: 1199,
        status: 'VERIFIED',
      },
      {
        name: 'Balaji V',
        email: 'balaji.provider@careconnect.com',
        skills: ['HVAC Technician', 'AC Diagnostics'],
        exp: 1,
        rating: 4.2,
        reviews: 15,
        rate: 399,
        status: 'PENDING',
      },
    ];

    const providerUsers = [];
    const providerProfiles = [];

    for (let i = 0; i < providerData.length; i++) {
      const p = providerData[i];
      const user = await User.create({
        name: p.name,
        email: p.email,
        password: commonPassword,
        phone: `97310000${i < 10 ? '0' + i : i}`,
        role: 'PROVIDER',
        location: { address: `${15 + i * 3}, 10th Main, Koramangala`, city: 'Bangalore' },
      });

      const profile = await ProviderProfile.create({
        userId: user._id,
        title: `Certified ${p.skills[0]}`,
        bio: `Dedicated home service professional with ${p.exp} years of hands-on experience in ${p.skills.join(', ')}. Guaranteed safety and quality.`,
        skills: p.skills,
        experienceYears: p.exp,
        serviceAreas: ['Indiranagar', 'Koramangala', 'HSR Layout', 'Whitefield', 'BTM Layout'],
        baseHourlyRate: p.rate,
        rating: p.rating,
        reviewCount: p.reviews,
        completedJobsCount: Math.round(p.reviews * 1.2),
        verificationStatus: p.status,
        documents: {
          governmentId: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
          skillCertificate: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
          addressProof: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
          experienceCertificate: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
        },
        weeklySlots: [
          { dayOfWeek: 'Monday', startTime: '09:00', endTime: '18:00', isAvailable: true },
          { dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '18:00', isAvailable: true },
          { dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '18:00', isAvailable: true },
          { dayOfWeek: 'Thursday', startTime: '09:00', endTime: '18:00', isAvailable: true },
          { dayOfWeek: 'Friday', startTime: '09:00', endTime: '18:00', isAvailable: true },
          { dayOfWeek: 'Saturday', startTime: '10:00', endTime: '16:00', isAvailable: true },
        ],
      });

      providerUsers.push(user);
      providerProfiles.push(profile);
    }

    console.log('Seeding Sample Requests, Quotes, Bookings, Invoices & Reviews...');
    // Create an active AC Repair booking for Customer 1 (Pavani) with Provider 1 (Rahul Kumar)
    const request1 = await ServiceRequest.create({
      customerId: customers[0]._id,
      categoryName: 'AC Repair',
      description: 'My AC is running but the room is not getting cold. Leaking water near filter.',
      aiAnalysis: {
        classifiedCategory: 'AC Repair',
        extractedSkills: ['HVAC Technician', 'AC Diagnostics', 'Cooling System Repair'],
        urgency: 'Medium',
        suggestedDuration: '1–2 hours',
        confidence: 0.94,
      },
      location: customers[0].location,
      preferredDate: new Date().toISOString().split('T')[0],
      preferredTimeSlot: '4:00 PM - 6:00 PM',
      status: 'BOOKED',
    });

    const quote1 = await Quote.create({
      requestId: request1._id,
      providerId: providerUsers[0]._id,
      providerProfileId: providerProfiles[0]._id,
      price: 499,
      estimatedDuration: '1.5 hours',
      message: 'Experienced HVAC specialist. Includes gas pressure check & filter wash.',
      status: 'ACCEPTED',
      aiMatchScore: 94,
    });

    const booking1 = await Booking.create({
      bookingNumber: 'BK-849102',
      requestId: request1._id,
      quoteId: quote1._id,
      customerId: customers[0]._id,
      providerId: providerUsers[0]._id,
      serviceCategory: 'AC Repair',
      schedule: {
        date: new Date().toISOString().split('T')[0],
        startTime: '16:00',
        endTime: '18:00',
        displaySlot: 'Today, 4:00 PM',
      },
      location: customers[0].location,
      price: 499,
      status: 'ON_THE_WAY',
      notes: 'Provider is arriving with equipment.',
      beforeEvidence: [
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
      ],
    });

    const invoice1 = await Invoice.create({
      invoiceNumber: 'INV-302194',
      bookingId: booking1._id,
      customerId: customers[0]._id,
      providerId: providerUsers[0]._id,
      serviceName: 'AC Repair & Cooling Diagnostics',
      baseServiceCost: 499,
      platformFee: 49,
      totalAmount: 548,
      items: [
        { description: 'AC Repair Base Diagnostics & Labor', amount: 499 },
        { description: 'CareConnect Platform Convenience Fee', amount: 49 },
      ],
      paymentStatus: 'UNPAID',
    });

    // Completed Plumbing Booking with Review
    const booking2 = await Booking.create({
      bookingNumber: 'BK-719302',
      customerId: customers[1]._id,
      providerId: providerUsers[2]._id,
      serviceCategory: 'Plumbing',
      schedule: {
        date: '2026-09-14',
        startTime: '11:00',
        endTime: '12:30',
        displaySlot: 'Sep 14, 11:00 AM',
      },
      location: customers[1].location,
      price: 349,
      status: 'COMPLETED',
      completedAt: new Date('2026-09-14T12:30:00'),
      customerConfirmed: true,
      afterEvidence: [
        'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80',
      ],
    });

    await Review.create({
      bookingId: booking2._id,
      customerId: customers[1]._id,
      providerId: providerUsers[2]._id,
      rating: 5,
      serviceQuality: 5,
      professionalism: 5,
      valueForMoney: 5,
      comment: 'Mohammed Ali fixed the leaking pipe under my kitchen sink in less than 30 minutes! Highly professional.',
    });

    // Sample Dispute
    await Dispute.create({
      ticketNumber: 'TKT-948102',
      bookingId: booking1._id,
      raisedBy: customers[0]._id,
      reason: 'The provider arrived 15 minutes late, requesting clarification on timing.',
      priority: 'Low',
      status: 'OPEN',
      assignedAgentId: supportAgents[0]._id,
      conversations: [
        {
          sender: customers[0]._id,
          senderName: customers[0].name,
          message: 'Can support verify the provider traffic status?',
        },
      ],
    });

    // System Audit Log Entry
    await AuditLog.create({
      actorId: admins[0]._id,
      actorRole: 'ADMIN',
      action: 'SYSTEM_DATABASE_SEEDED',
      entity: 'Platform',
      entityId: 'SYSTEM',
      metadata: { seedDate: new Date().toISOString() },
    });

    console.log('\n======================================================');
    console.log(' CareConnect Seed Script Executed Successfully!');
    console.log('======================================================');
    console.log(' Demo Login Accounts (Password for all: password123)');
    console.log(' ------------------------------------------------------');
    console.log(' 1. Customer:           customer@careconnect.com');
    console.log(' 2. Service Provider:   rahul.provider@careconnect.com');
    console.log(' 3. Operations Manager: ops@careconnect.com');
    console.log(' 4. Support Agent:      support@careconnect.com');
    console.log(' 5. Platform Admin:     admin@careconnect.com');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error during database seed:', error);
    process.exit(1);
  }
};

seedDB();
