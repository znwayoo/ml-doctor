import { AGE_MAP, GENDER_MAP, RACE_MAP, EDUCATION_MAP, BMI_CATEGORIES, BINARY_MAP, ALCOHOL_MAP } from './constants';

// Reverse the mapping objects
const reverseMap = (obj) => Object.entries(obj).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});

export const getFeatureLabel = (feature, value) => {
  switch (feature) {
    case 'age_group':
      return reverseMap(AGE_MAP)[value];
    case 'sex':
      return reverseMap(GENDER_MAP)[value];
    case 'race':
      return reverseMap(RACE_MAP)[value];
    case 'education':
      return reverseMap(EDUCATION_MAP)[value];
    case 'bmi_category':
      const numValue = Number(value);
      return Object.values(BMI_CATEGORIES).find(cat => cat.value === numValue)?.label || value;
    case 'physical_activity':
    case 'smoking_status':
    case 'high_blood_pressure':
    case 'high_cholesterol':
    case 'heart_disease':
    case 'kidney_disease':
      return reverseMap(BINARY_MAP)[value];
    case 'alcohol_consumption_cat':
      return reverseMap(ALCOHOL_MAP)[value];
    default:
      return value;
  }
}; 