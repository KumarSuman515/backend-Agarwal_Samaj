const candidateInfoConvert =(req)=> {
  return{
  // Personal Info
  name: req.body.name,
  dob: req.body.dob,
  birth_place: req.body.birth_place,
  candidate_gender: req.body.candidate_gender,
  manglik: req.body.manglik,
  gotra: req.body.gotra,
  maternal_gotra: req.body.maternal_gotra,

  // Family Info
  father_name: req.body.father_name,
  father_mobile: req.body.father_mobile,
  father_occupation: req.body.father_occupation || null,
  father_annual_income: req.body.father_annual_income ? parseInt(req.body.father_annual_income) : null,
  mother_name: req.body.mother_name || null,
  mother_occupation: req.body.mother_occupation || null,
  grandfather: req.body.grandfather || null,
  native_place: req.body.native_place || null,
  nationality: req.body.nationality || null,
  status_of_family: req.body.status_of_family || null,

  // Address & Contact
  address: req.body.address || null,
  country: req.body.country || "India",
  state: req.body.state,
  district: req.body.district || null,
  pin_code: req.body.pin_code || null,
  phone: req.body.phone || null,
  contact_no: req.body.contact_no,
  email: req.body.email,

  // Physical Details
  height: req.body.height,
  body_type: req.body.body_type,
  complexion: req.body.complexion,
  blood_group: req.body.blood_group,

  // Education & Profession
  education_detail: req.body.education_detail || null,
  education: req.body.education,
  hobby: req.body.hobby || null,
  occupation: req.body.occupation,
  designation: req.body.designation || null,
  annual_income: req.body.annual_income ? parseInt(req.body.annual_income) : null,
  company_name: req.body.company_name || null,
  company_city: req.body.company_city || null,

  // Siblings Info
  no_unmarried_brother: req.body.no_unmarried_brother ? parseInt(req.body.no_unmarried_brother) : 0,
  no_unmarried_sister: req.body.no_unmarried_sister ? parseInt(req.body.no_unmarried_sister) : 0,
  no_married_brother: req.body.no_married_brother ? parseInt(req.body.no_married_brother) : 0,
  no_married_sister: req.body.no_married_sister ? parseInt(req.body.no_married_sister) : 0,

  // Relatives Info
  relation: req.body.relation || null,
  relative_name: req.body.relative_name || null,
  relative_mobile_no: req.body.relative_mobile_no || null,
  relative_city: req.body.relative_city || null,
  relative_company_name: req.body.relative_company_name || null,
  relative_designation: req.body.relative_designation || null,
  relative_company_address: req.body.relative_company_address || null,

  // Extra
  kundali_milana: req.body.kundali_milana || null,
  about_me: req.body.about_me,
  image_path: req.body.image_path || "default-profile.jpg",

  // Subscription
  subscription: req.body.subscription === "1" || req.body.subscription === "true",
}};

module.exports = {candidateInfoConvert}