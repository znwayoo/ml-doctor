export const AGE_MAP = {
  "Age 18 to 24": 1,
  "Age 25 to 34": 2,
  "Age 35 to 44": 3,
  "Age 45 to 54": 4,
  "Age 55 to 64": 5,
  "Age 65 or older": 6
};

export const GENDER_MAP = {
  "Male": 0,
  "Female": 1
};

export const RACE_MAP = {
  "White": 1,
  "Black": 2,
  "Asian": 3,
  "American Indian/Alaskan Native": 4,
  "Hispanic": 5,
  "Other": 6
};

export const EDUCATION_MAP = {
  "Did not graduate High School": 1,
  "Graduated High School": 2,
  "Attended College or Technical School": 3,
  "Graduated from College or Technical School": 4
};

export const BMI_CATEGORIES = {
  UNDERWEIGHT: {
    value: 1,
    label: "Underweight",
    color: "#8B8000",
    emoji: "⚠️",
    range: [0, 18.5]
  },
  NORMAL: {
    value: 2,
    label: "Normal Weight",
    color: "green",
    emoji: "🟢",
    range: [18.5, 25]
  },
  OVERWEIGHT: {
    value: 3,
    label: "Overweight",
    color: "orange",
    emoji: "🟠",
    range: [25, 30]
  },
  OBESE: {
    value: 4,
    label: "Obese",
    color: "red",
    emoji: "🔴",
    range: [30, Infinity]
  }
};

export const BINARY_MAP = {
  "No": 0,
  "Yes": 1
};

export const ALCOHOL_MAP = {
  "No Alcohol": 0,
  "Rare (1-5)": 1,
  "Occasional (6-15)": 2,
  "Frequent (16-30)": 3
};

