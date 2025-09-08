const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:4000';

async function testBackend() {
  try {
    console.log('🧪 Testing Backend API...\n');

    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/`);
    console.log('✅ Health Check:', healthResponse.data);
    console.log('');

    // Test 2: Get All Candidates
    console.log('2. Testing Get All Candidates...');
    const candidatesResponse = await axios.get(`${BASE_URL}/api/candidates`);
    console.log('✅ Get Candidates:', {
      status: candidatesResponse.status,
      count: Array.isArray(candidatesResponse.data) ? candidatesResponse.data.length : 'Invalid response',
      data: Array.isArray(candidatesResponse.data) ? candidatesResponse.data.slice(0, 2) : candidatesResponse.data
    });
    console.log('');

    // Test 3: Test with sample data
    if (Array.isArray(candidatesResponse.data) && candidatesResponse.data.length > 0) {
      const firstCandidate = candidatesResponse.data[0];
      console.log('3. Testing Get Candidate by ID...');
      const singleResponse = await axios.get(`${BASE_URL}/api/candidates/${firstCandidate.id}`);
      console.log('✅ Get Single Candidate:', {
        status: singleResponse.status,
        id: singleResponse.data.id,
        name: singleResponse.data.name,
        age: calculateAge(singleResponse.data.dob),
        image_path: singleResponse.data.image_path
      });
      
      // Test 4: Test image URL if candidate has an image
      if (firstCandidate.image_path && firstCandidate.image_path !== "default-profile.jpg") {
        console.log('4. Testing Image URL...');
        const imageUrl = `${BASE_URL}/uploads/${firstCandidate.image_path}`;
        console.log('Image URL:', imageUrl);
        try {
          const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
          console.log('✅ Image served successfully, size:', imageResponse.data.length, 'bytes');
        } catch (imageError) {
          console.log('❌ Image not accessible:', imageError.message);
        }
      }
    }

    console.log('\n🎉 All tests passed! Backend is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

function calculateAge(dob) {
  if (!dob) return 0;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// Run the test
testBackend();
