import { 
  AGE_MAP, 
  GENDER_MAP, 
  RACE_MAP, 
  EDUCATION_MAP, 
  BMI_CATEGORIES,
  BINARY_MAP,
  ALCOHOL_MAP 
} from './constants';

export const calculateBMI = (weight, height) => {
  if (weight > 0 && height > 0) {
    const bmi = weight / Math.pow(height / 100, 2);
    
    for (const [category, info] of Object.entries(BMI_CATEGORIES)) {
      const [min, max] = info.range;
      if (bmi >= min && bmi < max) {
        return {
          bmi,
          category: info.label,
          color: info.color,
          emoji: info.emoji,
          value: info.value
        };
      }
    }
  }
  return null;
};

export const transformFormData = (formData) => {
  const bmiInfo = calculateBMI(parseFloat(formData.weight), parseFloat(formData.height));
  
  return {
    age_group: AGE_MAP[formData.age_group],
    sex: GENDER_MAP[formData.gender],
    race: RACE_MAP[formData.race],
    education: EDUCATION_MAP[formData.education],
    bmi_category: bmiInfo?.value || 1,
    physical_activity: BINARY_MAP[formData.physical_activity],
    alcohol_consumption_cat: ALCOHOL_MAP[formData.alcohol_consumption],
    smoking_status: BINARY_MAP[formData.smoking_status],
    high_blood_pressure: BINARY_MAP[formData.high_blood_pressure],
    high_cholesterol: BINARY_MAP[formData.high_cholesterol],
    heart_disease: BINARY_MAP[formData.heart_disease],
    kidney_disease: BINARY_MAP[formData.kidney_disease]
  };
};
