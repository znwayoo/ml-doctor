import streamlit as st
import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import OneHotEncoder, StandardScaler

#for local uncomment and comment out the models dictionary below
# models = {
#     "Decision Tree"         : joblib.load("models/dt_model.joblib"),
#     "Random Forest"         : joblib.load("models/rf_model.joblib"),
#     "XGB"                   : joblib.load("models/xgb_model.joblib"),
#     "LGB"                   : joblib.load("models/lgb_model.joblib"),
#     "Logistic Regression"   : joblib.load("models/lr_model.joblib"),
#     "KNN"                   : joblib.load("models/knn_model.joblib")
# }

#removed Random Forest and KNN models because the model sizes are too big for git (this will affect the remote deployed app)
models = {
    "Decision Tree"         : joblib.load("models/dt_model.joblib"),
    "XGB"                   : joblib.load("models/xgb_model.joblib"),
    "LGB"                   : joblib.load("models/lgb_model.joblib"),
    "Logistic Regression"   : joblib.load("models/lr_model.joblib")
}

age_map = {
    "Age 18 to 24"      :   1,
    "Age 25 to 34"      :   2,
    "Age 35 to 44"      :   3,
    "Age 45 to 54"      :   4,
    "Age 55 to 64"      :   5,
    "Age 65 or older"   :   6
}

gender_map = {
    "Male"      : 0,
    "Female"    : 1
}

race_map = {
    "White"                             :   1,
    "Black"                             :   2,
    "Asian"                             :   3,
    "American Indian/Alskan Native"     :   4,
    "Hispanic"                          :   5,
    "Other"                             :   6
}

edu_map = {
    "Did not graduate High School"                  :   1,
    "Graduated High School"                         :   2,
    "Attended College or Technical School"          :   3,
    "Graduated from College or Technical School"    :   4
}

bmi_map = {
    "Underweight"       :   1,
    "Normal Weight"     :   2,
    "Overweight"        :   3,
    "Obese"             :   4
}

physical_activity_map = {
    "No"    : 0,
    "Yes"   : 1
}

alcohol_map = {
    "No Alcohol"        :   0,
    "Rare (1-5)"        :   1,
    "Occasional (6-15)" :   2,
    "Frequent (16-30)"  :   3
}

smoking_map = {
    "No"    :   0,
    "Yes"   :   1
}

high_blood_pressure_map = {
    "No"    :   0,
    "Yes"   :   1
}

high_cholesterol_map = {
    "No"    :   0,
    "Yes"   :   1
}

heart_disease_map = {
    "No"    :   0,
    "Yes"   :   1
}

kidney_disease_map = {
    "No"    :   0,
    "Yes"   :   1
}

st.title(":hospital: Diabetic Doctor - Do you have diabetes? :thinking_face:")

#Collect Data

age_label = st.selectbox("Select your Age Group:", list(age_map.keys()))
age_encoded = age_map[age_label]

gender_label = st.selectbox("Select your gender:", list(gender_map.keys()))
gender_encoded = gender_map[gender_label]

race_label = st.selectbox("Select your race:", list(race_map.keys()))
race_encoded = race_map[race_label]

edu_label = st.selectbox("Select your eudcation level:", list(edu_map.keys()))
edu_encoded = edu_map[edu_label]

#BMI
weight_kg = st.number_input("Enter your weight (kg):", min_value=1.0, format="%.1f")
height_cm = st.number_input("Enter your height (cm):", min_value=1.0, format="%.1f")

#BMI calculation - weight(kg)/ height(m) ** 2
if weight_kg > 0 and height_cm > 0:
    bmi_val = weight_kg / (height_cm / 100) ** 2
    if bmi_val < 18.50:
        bmi_cat = "Underweight"
        bmi_color = "yellow"
        bmi_emoji = ":warning:"
    elif 18.50 <= bmi_val < 25.00:
        bmi_cat = "Normal Weight"
        bmi_color = "lime"
        bmi_emoji = ":green_circle:"
    elif 25.00 <= bmi_val < 30.00:
        bmi_cat = "Overweight"
        bmi_color = "orange"
        bmi_emoji = ":orange_circle:"
    else:
        bmi_cat = "Obese"
        bmi_color = "red"
        bmi_emoji = ":red_circle:"
    
    bmi_encoded = bmi_map[bmi_cat]
else:
    bmi_encoded = None

physical_activity_label = st.selectbox("Do you exercise?", list(physical_activity_map.keys()))
physical_activity_encoded = physical_activity_map[physical_activity_label]

alcohol_label = st.selectbox("Select your alcohol consumption within 30 days:", list(alcohol_map.keys()))
alcohol_encoded = alcohol_map[alcohol_label]

smoking_label = st.selectbox("Do you smoke?:", list(smoking_map.keys()))
smoking_encoded = smoking_map[smoking_label]

high_blood_pressure_label = st.selectbox("Do you have high blood pressure?", list(high_blood_pressure_map.keys()))
high_blood_pressure_encoded = high_blood_pressure_map[high_blood_pressure_label]

high_cholesterol_label = st.selectbox("Do you have high cholesterol?", list(high_cholesterol_map.keys()))
high_cholesterol_encoded = high_cholesterol_map[high_cholesterol_label]

heart_disease_label = st.selectbox("Do you have heart disease?", list(heart_disease_map.keys()))
heart_disease_encoded = heart_disease_map[heart_disease_label]

kidney_disease_label = st.selectbox("Do you have kidney disease?", list(kidney_disease_map.keys()))
kidney_disease_encoded = kidney_disease_map[kidney_disease_label]


user_input_df = pd.DataFrame({
    "age_group": [age_encoded],
    "sex": [gender_encoded],
    "race": [race_encoded],
    "education": [edu_encoded],
    "bmi_category": [bmi_encoded],
    "physical_activity": [physical_activity_encoded],
    "alcohol_consumption_cat": [alcohol_encoded],
    "smoking_status": [smoking_encoded],
    "high_blood_pressure": [high_blood_pressure_encoded],
    "high_cholesterol": [high_cholesterol_encoded],
    "heart_disease": [heart_disease_encoded],
    "kidney_disease": [kidney_disease_encoded]
})

#OneHot Encoding for models trained with onehot encoded features

features_to_encode = ['age_group', 'race', 'education', 'bmi_category', 'alcohol_consumption_cat']

binary_features = ['sex', 'physical_activity', 'smoking_status', 'high_blood_pressure', 'high_cholesterol', 'heart_disease', 'kidney_disease']

encoder = joblib.load('models/one_hot_encoder.joblib')
scaler = joblib.load('models/standard_scaler.joblib')

encoded_features = encoder.transform(user_input_df[features_to_encode])
encoded_features_df = pd.DataFrame(encoded_features, columns=encoder.get_feature_names_out())

user_input_onehot = pd.concat([encoded_features_df, user_input_df[binary_features]], axis=1)

user_input_onehot_scaled = scaler.transform(user_input_onehot)

#Prediction

if st.button("Get your results!"):
    if bmi_encoded is None:
        st.error("Please enter valid weight and height values to calculate BMI.")
    else:
        results = {}
        for model_name, model in models.items():
            if model_name not in ["Logistic Regression", "KNN"]:
                pred = model.predict_proba(user_input_df)[0][1]
                results[model_name] = pred
            elif model_name == "Logistic Regression":
                pred = model.predict_proba(user_input_onehot_scaled)[0][1]
                results[model_name] = pred
            elif model_name == "KNN":
                pred = model.predict_proba(user_input_onehot_scaled)[0][1]
                results[model_name] = pred
            
        st.subheader(":bar_chart: Prediction Results:")

        st.markdown(
            f"""
            Your BMI Category indicates that you are 
            <span style="color:{bmi_color}; font-size:16px;"><b>{bmi_cat}</b></span> {bmi_emoji}
            """,
            unsafe_allow_html=True,
        )
        for model, proba in results.items():
            if proba > 0.5:
                color = "red"
                emoji = ":warning:"
            elif 0.3 <= proba <= 0.5:
                color = "yellow"
                emoji = ":warning:"
            else:
                color = "lime"
                emoji = ":thumbsup:"
            
            st.markdown(
                f"""
                {model} predicts that you have a 
                <b>risk of diabetes</b>: <span style="color:{color}; font-size:16px;"><b>{proba:.2%}</b></span> {emoji}
                """,
                unsafe_allow_html=True,
            )