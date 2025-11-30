import { Patient, Sample, SampleStatus, QCResult, QCStatus, DocumentSOP } from './types';

export const MOCK_PATIENTS: Patient[] = [
  { id: 'P001', name: 'John Doe', dob: '1985-04-12', mrn: 'MRN-8821', gender: 'Male' },
  { id: 'P002', name: 'Jane Smith', dob: '1992-09-23', mrn: 'MRN-9932', gender: 'Female' },
  { id: 'P003', name: 'Robert Johnson', dob: '1978-01-15', mrn: 'MRN-1120', gender: 'Male' },
  { id: 'P004', name: 'Emily Davis', dob: '1990-11-30', mrn: 'MRN-4451', gender: 'Female' },
];

export const MOCK_SAMPLES: Sample[] = [
  { id: 'S001', patientId: 'P001', type: 'Whole Blood (EDTA)', collectionDate: '2023-10-26T08:30:00', status: SampleStatus.ANALYZED, barcode: '8821-S01' },
  { id: 'S002', patientId: 'P002', type: 'Serum', collectionDate: '2023-10-26T09:15:00', status: SampleStatus.PROCESSING, barcode: '9932-S01' },
  { id: 'S003', patientId: 'P003', type: 'Tissue Biopsy', collectionDate: '2023-10-26T10:00:00', status: SampleStatus.RECEIVED, barcode: '1120-S01' },
  { id: 'S004', patientId: 'P004', type: 'Urine', collectionDate: '2023-10-26T11:45:00', status: SampleStatus.COLLECTED, barcode: '4451-S01' },
];

// Generate trend data for QC (simulating a slight drift then a spike)
const generateQCData = (): QCResult[] => {
  const results: QCResult[] = [];
  const baseMean = 100;
  const sd = 5;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    let noise = (Math.random() - 0.5) * sd * 2; // Random noise within +/- 1 SD roughly
    let val = baseMean + noise;

    // Simulate a drift upwards in the last 5 days
    if (i > 25) {
      val += (i - 25) * 3;
    }

    let status = QCStatus.IN_CONTROL;
    if (Math.abs(val - baseMean) > 3 * sd) status = QCStatus.OUT_OF_CONTROL;
    else if (Math.abs(val - baseMean) > 2 * sd) status = QCStatus.WARNING;

    results.push({
      id: `QC-${i}`,
      testName: 'Hemoglobin A1c',
      timestamp: date.toISOString().split('T')[0],
      value: parseFloat(val.toFixed(2)),
      mean: baseMean,
      sd: sd,
      status: status,
      instrumentId: 'INST-01'
    });
  }
  return results;
};

export const MOCK_QC_DATA: QCResult[] = generateQCData();

export const MOCK_DOCUMENTS: DocumentSOP[] = [
  {
    id: 'DOC-001',
    title: 'Specimen Collection: Venipuncture',
    content: `1. PURPOSE
To establish a standard procedure for the safe and correct collection of blood samples via venipuncture.

2. SCOPE
This procedure applies to all phlebotomists, nurses, and laboratory personnel authorized to perform venipuncture.

3. MATERIALS & EQUIPMENT
- Tourniquet (single-use)
- Alcohol prep pads (70% Isopropyl alcohol)
- Vacutainer needles (21G or 22G)
- Vacutainer holder
- Specimen tubes (Lavender, Red, Blue top as required)
- Gauze pads
- Adhesive bandage
- Biohazard sharps container
- Gloves

4. PROCEDURE
4.1 Patient Identification
   - Ask the patient to state their full name and date of birth.
   - Verify against the requisition form and patient wristband (if inpatient).
   - Ensure at least two identifiers match.

4.2 Site Selection
   - Position the patient comfortably.
   - Inspect the antecubital fossa for a suitable vein (Median cubital, Cephalic, or Basilic).
   - Avoid areas with hematomas, scarring, or IV lines.

4.3 Preparation
   - Perform hand hygiene and don gloves.
   - Apply the tourniquet 3-4 inches above the site. Do not leave on for >1 minute.
   - Palpate the vein.
   - Cleanse the site with alcohol in a circular motion, moving outward. Allow to air dry for 30 seconds.

4.4 Puncture
   - Anchor the vein by pulling the skin taut below the site.
   - Insert the needle, bevel up, at a 15-30 degree angle.
   - Push the tube onto the needle within the holder. Ensure blood flows.
   - Release tourniquet as soon as blood flow is established.

4.5 Order of Draw
   1. Blood Culture (Yellow)
   2. Sodium Citrate (Blue)
   3. Serum Tubes (Red/Gold)
   4. Heparin (Green)
   5. EDTA (Lavender/Pink)
   6. Fluoride/Oxalate (Gray)

4.6 Completion
   - Remove the last tube.
   - Place gauze over the site and withdraw the needle swiftly.
   - Engage safety device on needle immediately.
   - Apply pressure to the site.

5. SAFETY PRECAUTIONS
- Dispose of all sharps immediately in sharps containers.
- Treat all blood as potentially infectious.
- If a needlestick injury occurs, wash the area immediately and report to supervisor.`,
    version: '1.2',
    lastUpdated: '2023-09-15',
    status: 'Approved'
  },
  {
    id: 'DOC-002',
    title: 'Centrifuge Maintenance',
    content: `1. PURPOSE
To ensure the proper function and safety of laboratory centrifuges through regular maintenance.

2. FREQUENCY
- Daily: Visual inspection
- Weekly: Cleaning of rotor chamber
- Monthly: Calibration check

3. PROCEDURE
3.1 Daily Inspection
   - Check for physical damage to the lid or latch.
   - Ensure the centrifuge is balanced before every run.

3.2 Weekly Cleaning
   - Turn off and unplug the centrifuge.
   - Remove the buckets and adapters.
   - Clean the interior bowl with a 10% bleach solution or approved disinfectant.
   - Wipe down the exterior.
   - Allow all parts to dry completely before reassembly.

3.3 Monthly Calibration (Speed Check)
   - Use a calibrated tachometer.
   - Set centrifuge to 1000, 2000, and 3000 RPM.
   - Measure actual speed through the viewing port.
   - Tolerance: +/- 50 RPM.
   - Record results in the Equipment Maintenance Log.

4. TROUBLESHOOTING
- Vibration: Stop immediately. Check for load imbalance or loose rotor.
- Noise: Check for debris in the chamber.`,
    version: '1.0',
    lastUpdated: '2023-10-01',
    status: 'Draft'
  }
];