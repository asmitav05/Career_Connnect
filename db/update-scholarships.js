/**
 * CareerConnect Scholarship Verification & Audit Tool
 * 
 * Allows administrators and data operators to:
 * 1. Audit active scholarship records in the database.
 * 2. Update deadlines, academic years, or status based on newly gazetted official circulars.
 * 3. Mark unverified or expired schemes with "Status unverified" without code modifications.
 */

const Database = require('./database.js');

async function listAllScholarships() {
  const scholarships = await Database.scholarships.findAll();
  console.log(`\n--- CAREERCONNECT DATABASE: ${scholarships.length} VERIFIED SCHOLARSHIPS ---`);
  scholarships.forEach((s, idx) => {
    console.log(`[${idx + 1}] ${s.name}`);
    console.log(`    ID: ${s.id} | Status: ${s.verification_status} | Academic Year: ${s.academic_year}`);
    console.log(`    Provider: ${s.provider}`);
    console.log(`    Official Apply: ${s.official_apply_url}`);
    console.log(`    Deadline: ${s.deadline} | Last Verified: ${s.last_verified_date}`);
  });
}

async function updateScholarshipStatus(id, newStatus, deadline, verifiedDate) {
  const existing = await Database.scholarships.findById(id);
  if (!existing) {
    console.error(`Scholarship with ID "${id}" not found.`);
    return false;
  }

  const updates = { ...existing };
  if (newStatus) updates.verification_status = newStatus;
  if (deadline) updates.deadline = deadline;
  if (verifiedDate) updates.last_verified_date = verifiedDate;
  else updates.last_verified_date = new Date().toISOString().split('T')[0];

  await Database.scholarships.upsert(updates);
  console.log(`Updated scholarship "${id}": Status=${updates.verification_status}, Deadline=${updates.deadline}, Verified=${updates.last_verified_date}`);
  return true;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length === 0 || args[0] === '--list') {
    listAllScholarships();
  } else if (args[0] === '--update' && args[1]) {
    const id = args[1];
    const status = args[2] || 'verified';
    const deadline = args[3] || null;
    const date = args[4] || null;
    updateScholarshipStatus(id, status, deadline, date);
  } else {
    console.log('Usage:');
    console.log('  node db/update-scholarships.js --list');
    console.log('  node db/update-scholarships.js --update <scholarship_id> <status: verified|unverified> [deadline] [date]');
  }
}

module.exports = { listAllScholarships, updateScholarshipStatus };
