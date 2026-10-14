// generateAcademicDocs.js - Compiles Synopsis and SRS to PDF and DOCX
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFile, spawn } from 'child_process';
import { promisify } from 'util';
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  BorderStyle, 
  AlignmentType 
} from 'docx';

import { generateSynopsisHtml } from './synopsisContent.js';
import { generateSrsHtml } from './srsContent.js';

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WORKSPACE_ROOT = path.resolve(__dirname, '../../../');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function getBrowserPath() {
  if (fs.existsSync(EDGE_PATH)) return EDGE_PATH;
  if (fs.existsSync(CHROME_PATH)) return CHROME_PATH;
  throw new Error('Neither Microsoft Edge nor Google Chrome was found for PDF generation.');
}

async function convertHtmlToPdf(htmlFilePath, pdfOutputPath) {
  const browserPath = getBrowserPath();
  const fileUrl = `file:///${htmlFilePath.replace(/\\/g, '/')}`;

  console.log(`Rendering PDF: ${path.basename(pdfOutputPath)} using ${path.basename(browserPath)}...`);

  return new Promise((resolve, reject) => {
    const proc = spawn(browserPath, [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--disable-extensions',
      `--print-to-pdf=${pdfOutputPath}`,
      fileUrl
    ]);

    proc.on('close', (code) => {
      if (code === 0 && fs.existsSync(pdfOutputPath) && fs.statSync(pdfOutputPath).size > 1000) {
        console.log(`✅ Generated PDF: ${pdfOutputPath} (${Math.round(fs.statSync(pdfOutputPath).size / 1024)} KB)`);
        resolve();
      } else {
        reject(new Error(`Browser exited with code ${code} or PDF not generated.`));
      }
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
}

function createDocxSynopsis() {
  const doc = new Document({
    creator: 'RentRide Project Team',
    title: 'RentRide - Project Synopsis',
    description: 'B.Tech CSE Major Project Synopsis',
    sections: [{
      properties: {
        page: {
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } // 1 inch
        }
      },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: 'DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING', bold: true, size: 28, font: 'Times New Roman' }),
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: 'ACADEMIC SESSION: 2023–2027\n\n', size: 22, font: 'Times New Roman' }),
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: 'PROJECT SYNOPSIS\n', bold: true, size: 32, color: 'B33927', font: 'Times New Roman' }),
            new TextRun({ text: 'RENT RIDE — MULTI-VENDOR VEHICLE RENTAL MARKETPLACE\n', bold: true, size: 36, font: 'Times New Roman' }),
            new TextRun({ text: 'A Resilient Cloud-Native Platform with Zero-Collision Scheduling, Tiered Pricing, and Machine Learning Telemetry\n\n', italics: true, size: 22, font: 'Times New Roman' }),
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: 'Submitted in partial fulfillment of the requirements for the degree of\n', size: 22, font: 'Times New Roman' }),
            new TextRun({ text: 'Bachelor of Technology (B.Tech) in Computer Science and Engineering\n\n', bold: true, size: 24, font: 'Times New Roman' }),
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Student Name: __________________________\tProject Guide: __________________________\n', font: 'Times New Roman', size: 22 }),
            new TextRun({ text: 'Roll Number: __________________________\tDesignation: Assistant Professor\n', font: 'Times New Roman', size: 22 }),
            new TextRun({ text: 'Enrollment No: __________________________\tDepartment of Computer Science & Engg.\n', font: 'Times New Roman', size: 22 }),
            new TextRun({ text: 'Semester: VIII (Final Year Major Project)\tInstitution: __________________________\n\n', font: 'Times New Roman', size: 22 }),
          ]
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: '1. ABSTRACT', bold: true, size: 28, font: 'Times New Roman' })]
        }),
        new Paragraph({
          children: [new TextRun({
            text: 'RentRide is an enterprise-grade, multi-vendor vehicle rental marketplace engineered to unite vehicle customers, independent fleet vendors, and platform administrators. Built with React 18, Vite, Node.js, Express, MongoDB, and an auxiliary Python FastAPI machine learning microservice, the platform guarantees zero overlapping reservations via mathematical interval overlap prevention, flexible Hourly/12h/24h rental plans, server-side dynamic pricing, Razorpay payment capture, and AI telemetry.',
            font: 'Times New Roman', size: 22
          })]
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: '2. INTRODUCTION & MOTIVATION', bold: true, size: 28, font: 'Times New Roman' })]
        }),
        new Paragraph({
          children: [new TextRun({
            text: 'Increasing urban congestion and temporary commuter needs across smart cities like Indore, Bhopal, and Gwalior have driven demand for flexible vehicle rentals. RentRide solves fragmentation by providing local vendors with digital onboarding, collision-free scheduling, digital trip custody, and AI demand forecasting.',
            font: 'Times New Roman', size: 22
          })]
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: '3. PROBLEM STATEMENT', bold: true, size: 28, font: 'Times New Roman' })]
        }),
        new Paragraph({
          children: [new TextRun({
            text: 'Conventional vehicle rental systems suffer from inventory fragmentation, double booking collisions, inflexible 24-hour day pricing, lack of fuel transparency, manual registers, and absence of predictive demand intelligence.',
            font: 'Times New Roman', size: 22
          })]
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: '4. PROPOSED SYSTEM & OBJECTIVES', bold: true, size: 28, font: 'Times New Roman' })]
        }),
        new Paragraph({
          children: [new TextRun({
            text: 'RentRide delivers a multi-vendor cloud platform with zero-collision scheduling, custom hourly durations (1-24h), a 10-minute temporary checkout reservation lock, a dynamic distance-based fuel calculator, Razorpay integration, 327 verified vehicle catalog models, and a Python FastAPI ML microservice for recommendations, demand forecasting, and dynamic pricing.',
            font: 'Times New Roman', size: 22
          })]
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: '5. TECHNOLOGY STACK', bold: true, size: 28, font: 'Times New Roman' })]
        }),
        new Paragraph({
          children: [new TextRun({
            text: 'Frontend: React 18.3.1, Vite 6.1.0, React Router DOM 7.1.5, Redux Toolkit 2.5.1, Tailwind CSS 3.4.17, Axios 1.7.9.\nBackend: Node.js, Express 4.21.2, Mongoose 8.10.1, MongoDB Atlas, JWT, bcryptjs, Helmet, Zod.\nAI Microservice: Python 3, FastAPI 0.115.8, Uvicorn, Scikit-learn 1.6.1, Pandas, NumPy.\nCloud Services: Cloudinary, Razorpay.',
            font: 'Times New Roman', size: 22
          })]
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: '6. IMPLEMENTATION STATUS & ROADMAP', bold: true, size: 28, font: 'Times New Roman' })]
        }),
        new Paragraph({
          children: [new TextRun({
            text: 'Currently 100% operational: Authentication, Role Guards, Categories, Fleet Discovery, Collision Engine, Flexible Hourly Plans, Dynamic Fuel Calculator, Server Pricing, Razorpay Integration, Vendor Portal, Trip Custody Handover/Return, Admin Moderation, 327-vehicle Master Catalog, and FastAPI Microservice.\nPartially Implemented: Automated Razorpay refund live trigger, Admin KYC action buttons.\nPlanned Roadmap: Automated lock expiry background sweeper, Email/SMS notifications, Interactive map pins, Vendor payout ledger, Live GPS telematics, Redis caching, and Docker containerization.',
            font: 'Times New Roman', size: 22
          })]
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: '7. CONCLUSION', bold: true, size: 28, font: 'Times New Roman' })]
        }),
        new Paragraph({
          children: [new TextRun({
            text: 'RentRide demonstrates a complete, resilient, and enterprise-grade multi-vendor vehicle rental marketplace that eliminates double-booking collisions, provides flexible pricing, and empowers local fleet operators with predictive machine learning.',
            font: 'Times New Roman', size: 22
          })]
        })
      ]
    }]
  });

  return doc;
}

function createDocxSrs() {
  const doc = new Document({
    creator: 'RentRide Project Team',
    title: 'RentRide - Software Requirements Specification (SRS)',
    description: 'B.Tech CSE Major Project SRS Document',
    sections: [{
      properties: {
        page: {
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: 'DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING', bold: true, size: 28, font: 'Times New Roman' }),
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: 'ACADEMIC SESSION: 2023–2027\n\n', size: 22, font: 'Times New Roman' }),
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: 'SOFTWARE REQUIREMENTS SPECIFICATION (SRS)\n', bold: true, size: 32, color: 'B33927', font: 'Times New Roman' }),
            new TextRun({ text: 'RENTRIDE — MULTI-VENDOR VEHICLE RENTAL MARKETPLACE\n\n', bold: true, size: 36, font: 'Times New Roman' }),
          ]
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: '1. INTRODUCTION', bold: true, size: 28, font: 'Times New Roman' })]
        }),
        new Paragraph({
          children: [new TextRun({
            text: 'This document defines the complete functional and non-functional requirements for the RentRide platform. RentRide is a decoupled three-tier system (React 18 SPA, Express REST API, MongoDB) augmented by a Python FastAPI machine learning microservice for vehicle rentals across two-wheelers and four-wheelers.',
            font: 'Times New Roman', size: 22
          })]
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: '2. USER CLASSES & OPERATING ENVIRONMENT', bold: true, size: 28, font: 'Times New Roman' })]
        }),
        new Paragraph({
          children: [new TextRun({
            text: 'The platform serves Public Guests, Customers, Vendors, and Administrators with strict Role-Based Access Control (RBAC). It runs across modern standards-compliant web browsers, Node.js 18/20 LTS, Python 3.10+, and MongoDB 6.0+ on cloud Atlas.',
            font: 'Times New Roman', size: 22
          })]
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: '3. FUNCTIONAL REQUIREMENTS SUMMARY', bold: true, size: 28, font: 'Times New Roman' })]
        }),
        new Paragraph({
          children: [new TextRun({
            text: 'Key functional requirements include:\n• FR-AUTH (1-8): JWT authentication, Bcrypt password hashing, rate limiting.\n• FR-SRCH & FR-AVAL: City hub filtering (Indore, Bhopal, Gwalior), interval overlap collision checking ((StartReq < EndExist) and (EndReq > StartExist)).\n• FR-PLAN & FR-BOOK: Hourly custom plans (1-24h), 12h, 24h plans, 10-minute checkout inventory locks.\n• FR-PRIC & FR-PAY: Server pricing engine (1.15x weekend surge, 5% fee, 18% GST, deposit), Razorpay order creation and HMAC-SHA256 signature verification.\n• FR-TRIP & FR-MAINT: Digital trip custody (Start Trip odometer, Complete Trip return with extra km penalty), vendor maintenance scheduling.\n• FR-AI: FastAPI microservice providing cosine similarity vehicle recommendations, 7-day demand forecasting, and dynamic pricing (0.90x to 1.35x).',
            font: 'Times New Roman', size: 22
          })]
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: '4. NON-FUNCTIONAL REQUIREMENTS', bold: true, size: 28, font: 'Times New Roman' })]
        }),
        new Paragraph({
          children: [new TextRun({
            text: 'NFR-001 Performance (sub-250ms API response), NFR-002 Security (JWT, Bcrypt, Helmet, CORS, Zod validation), NFR-004 Availability (99.5%), NFR-008 Data Integrity (compound index atomic collision queries), NFR-010 Error Handling (standardized ApiResponse and ApiError contracts).',
            font: 'Times New Roman', size: 22
          })]
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: '5. DATABASE SCHEMA & DATA DICTIONARY', bold: true, size: 28, font: 'Times New Roman' })]
        }),
        new Paragraph({
          children: [new TextRun({
            text: 'Ten primary MongoDB document models: User, Vehicle, Booking, Category, Coupon, Payment, Review, Maintenance, Notification, and VehicleCatalog (327 verified Indian models with ARAI certified mileage). Compound indexes guarantee atomic conflict prevention.',
            font: 'Times New Roman', size: 22
          })]
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: '6. SYSTEM LIMITATIONS & FUTURE ROADMAP', bold: true, size: 28, font: 'Times New Roman' })]
        }),
        new Paragraph({
          children: [new TextRun({
            text: 'Documented limitations: automated Razorpay refund live API trigger and admin KYC approval buttons are partially implemented. Roadmap includes lock expiry background sweeper cron, Email/SMS notifications via SendGrid/Twilio, interactive map integration, vendor payout ledgers, live GPS telematics, Redis caching, and Docker containerization.',
            font: 'Times New Roman', size: 22
          })]
        })
      ]
    }]
  });

  return doc;
}

async function main() {
  console.log('====================================================');
  console.log('  RentRide Academic Documentation Generation Suite  ');
  console.log('====================================================\n');

  // Paths
  const synopsisHtmlPath = path.join(WORKSPACE_ROOT, 'RentRide_Project_Synopsis.html');
  const synopsisPdfPath = path.join(WORKSPACE_ROOT, 'RentRide_Project_Synopsis.pdf');
  const synopsisDocxPath = path.join(WORKSPACE_ROOT, 'RentRide_Project_Synopsis.docx');

  const srsHtmlPath = path.join(WORKSPACE_ROOT, 'RentRide_SRS.html');
  const srsPdfPath = path.join(WORKSPACE_ROOT, 'RentRide_SRS.pdf');
  const srsDocxPath = path.join(WORKSPACE_ROOT, 'RentRide_SRS.docx');

  // 1. Generate HTML source files
  console.log('1. Generating academic HTML templates with embedded vector SVG diagrams...');
  const synopsisHtml = generateSynopsisHtml();
  fs.writeFileSync(synopsisHtmlPath, synopsisHtml, 'utf-8');
  console.log(`   Written: ${synopsisHtmlPath} (${Math.round(synopsisHtml.length / 1024)} KB)`);

  const srsHtml = generateSrsHtml();
  fs.writeFileSync(srsHtmlPath, srsHtml, 'utf-8');
  console.log(`   Written: ${srsHtmlPath} (${Math.round(srsHtml.length / 1024)} KB)`);

  // 2. Convert to PDF using Headless Edge / Chrome
  console.log('\n2. Compiling HTML to PDF using headless Chromium engine...');
  await convertHtmlToPdf(synopsisHtmlPath, synopsisPdfPath);
  await convertHtmlToPdf(srsHtmlPath, srsPdfPath);

  // 3. Generate DOCX versions
  console.log('\n3. Building editable Microsoft Word (.docx) documents...');
  const synopsisDoc = createDocxSynopsis();
  const synopsisBuffer = await Packer.toBuffer(synopsisDoc);
  fs.writeFileSync(synopsisDocxPath, synopsisBuffer);
  console.log(`   ✅ Generated DOCX: ${synopsisDocxPath} (${Math.round(synopsisBuffer.length / 1024)} KB)`);

  const srsDoc = createDocxSrs();
  const srsBuffer = await Packer.toBuffer(srsDoc);
  fs.writeFileSync(srsDocxPath, srsBuffer);
  console.log(`   ✅ Generated DOCX: ${srsDocxPath} (${Math.round(srsBuffer.length / 1024)} KB)`);

  console.log('\n====================================================');
  console.log('  ALL ACADEMIC DOCUMENTS GENERATED SUCCESSFULLY!    ');
  console.log('====================================================');
  console.log('Outputs:');
  console.log('1. ' + synopsisPdfPath);
  console.log('2. ' + srsPdfPath);
  console.log('3. ' + synopsisDocxPath);
  console.log('4. ' + srsDocxPath);
  console.log('5. ' + synopsisHtmlPath);
  console.log('6. ' + srsHtmlPath);
}

main().catch(err => {
  console.error('Document generation failed:', err);
  process.exit(1);
});
