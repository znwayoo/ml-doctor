import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { api } from '../services/api';

export default function ProjectFindings() {
  const [diabetesData, setDiabetesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featureImportance, setFeatureImportance] = useState(null);
  const [selectedModel, setSelectedModel] = useState('Decision Tree');

  useEffect(() => {
    const fetchDiabetesDistribution = async () => {
      try {
        const data = await api.getDistribution('diabetes_status');
        // Transform the data for side-by-side bars
        const transformedData = [
          {
            status: 'No Diabetes',
            percentage: data['0'] || 0,
            fill: '#4CAF50'
          },
          {
            status: 'Has Diabetes',
            percentage: data['1'] || 0,
            fill: '#F44336'
          }
        ];
        setDiabetesData(transformedData);
      } catch (err) {
        console.error('Error fetching diabetes distribution:', err);
        setError('Failed to load diabetes distribution data');
      } finally {
        setLoading(false);
      }
    };

    fetchDiabetesDistribution();
  }, []);

  useEffect(() => {
    const fetchFeatureImportance = async () => {
        try {
            const data = await api.getFeatureImportance();
            setFeatureImportance(data);
        } catch (err) {
            console.error('Error fetching feature importance:', err);
        }
    };

    fetchFeatureImportance();
}, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">
        Diabetes Risk Prediction Using Machine Learning
      </h1>

      {/* Motivation Section */}
      <section className="prose lg:prose-xl mb-12">
        <h2 className="text-2xl font-bold mb-4">Motivation</h2>
        <p>
          The motivation for this project is to develop a data science solution
          using publicly available, credible healthcare data to analyze a common
          but non-fatal disease with the potential for long-term health
          complications. Additionally, this project serves as an opportunity to
          refine my skills in data analysis, processing, and solution
          development, contributing to my expertise in the field regardless of
          the practical applicability of the final outcome.
        </p>
      </section>

      {/* Data Information Section */}
      <section className="prose lg:prose-xl mb-12">
        <h2 className="text-2xl font-bold mb-4">Data Information</h2>
        <p className="mb-2">
          The dataset used in this project is obtained from the CDC's Behavioral
          Risk Factor Surveillance System (BRFSS) survey, which is conducted
          annually and contains extensive health-related information.
        </p>
        <p className="mb-2">
          For this project, I utilized the 2023 BRFSS survey dataset, which can
          be downloaded from the{" "}
          <a
            href="https://www.cdc.gov/brfss/annual_data/annual_2023.html"
            className="text-indigo-600 hover:text-indigo-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            CDC BRFSS 2023 Data
          </a>{" "}
          website.
        </p>
        <p className="mb-2">
          The dataset consists of 350 columns and 433,323 rows. Detailed
          information about the survey data, including variable definitions and
          labeling conventions, is available in the official{" "}
          <a
            href="https://www.cdc.gov/brfss/annual_data/2023/zip/codebook23_llcp-v2-508.zip"
            className="text-indigo-600 hover:text-indigo-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            codebook
          </a>
          .
        </p>
        <p>
          The dataset is semi-processed and follows a unique labeling system.
          Using the codebook, we can interpret and understand the variables
          included in the survey.
        </p>
      </section>

      {/* Data Preprocessing Section */}
      <section className="prose lg:prose-xl mb-12">
        <h2 className="text-2xl font-bold mb-4">Data Preprocessing</h2>
        <ol className="list-decimal pl-6">
          <li>
            Once the 25 features and 1 target variable were selected, I created
            a new dataframe and exported it as a CSV file to allow easier access
            without the need to load the large original dataset.
          </li>
          <li>
            The dataframe column names were converted into more readable
            formats.
          </li>
          <li>
            I then analyzed the dataframe for missing values and found that
            columns under the
            <strong> Healthcare Access & Monitoring</strong> and{" "}
            <strong>Diabetes Conditions</strong> groups had missing values
            ranging from approximately <strong>60% to 95%</strong>. Since these
            columns were not crucial for determining diabetes risk and contained
            a high percentage of missing data, I decided to drop them to improve
            model training.
          </li>
          <li>
            At this stage, only <strong>14 features + 1 target variable</strong>{" "}
            remained.
          </li>
          <li>
            Missing values coded as "Don't know" or similar responses were
            consolidated to prepare for further missing value handling.
          </li>
          <li>
            Columns with more than <strong>20% missing values</strong> were
            dropped.
          </li>
          <li>
            The remaining categorical features were cleaned and properly
            label-encoded according to the codebook, ensuring that the entire
            dataframe contained only categorical data.
          </li>
        </ol>
      </section>

      {/* Existing Distribution Chart Section */}
      <h2 className="text-2xl font-bold mb-4">Data Visualization</h2>
      <section className="bg-white rounded-lg shadow p-6 mb-12">
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-600 text-center p-4">{error}</div>
        ) : (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={diabetesData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="status"
                  tick={{ fill: "#666" }}
                  tickLine={{ stroke: "#666" }}
                />
                <YAxis
                  label={{
                    value: "Percentage (%)",
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle" },
                  }}
                  domain={[0, 100]}
                  tick={{ fill: "#666" }}
                  tickLine={{ stroke: "#666" }}
                />
                <Tooltip
                  formatter={(value) => [`${value.toFixed(2)}%`, "Percentage"]}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
                <Bar
                  dataKey="percentage"
                  radius={[4, 4, 0, 0]}
                  fillOpacity={0.8}
                  animationDuration={1000}
                  fill={(entry) => entry.fill}
                >
                  <LabelList
                    dataKey="percentage"
                    position="top"
                    formatter={(value) => `${value.toFixed(2)}%`}
                    style={{
                      fill: "#666",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="mt-4 text-sm text-gray-600">
          <p>
            This chart illustrates the distribution of diabetes cases in the
            dataset, highlighting the class imbalance, with 86.2% non-diabetic
            and 13.8% diabetic cases.
          </p>
        </div>
      </section>

      {/* Data Preparation Section */}
      <section className="prose lg:prose-xl mb-12">
        <h2 className="text-2xl font-bold mb-4">Data Preparation</h2>
        <ul className="list-disc pl-6">
          <li>
            Due to the imbalanced dataset, I decided to use{" "}
            <strong>SMOTE</strong> for oversampling to balance the data.
          </li>
          <li>
            I selected a combination of models for training:{" "}
            <strong>Logistic Regression</strong> and
            <strong> KNN</strong> for distance-based methods, and{" "}
            <strong>Decision Tree, Random Forest, XGBoost, and LightGBM</strong>{" "}
            for tree-based approaches, as these models are commonly used for
            similar classification tasks.
          </li>
          <li>
            For <strong>tree-based models</strong>, I used the cleaned dataframe
            with <strong>12 features</strong> as these models can handle
            categorical data directly.
          </li>
          <li>
            For <strong>distance-based models</strong>, I applied{" "}
            <strong>one-hot encoding</strong> to specific categorical columns to
            ensure proper training.
          </li>
          <li>
            I performed a <strong>70/30 train-test split</strong> to evaluate
            model performance on unseen data.
          </li>
        </ul>
      </section>

      {/* Training Results Section */}
      <section className="prose lg:prose-xl mb-12">
        <h2 className="text-2xl font-bold mb-4">
          Training Results & Evaluation
        </h2>
        <div className="bg-white rounded-lg shadow">
          <div className="max-h-[600px] overflow-y-auto relative">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                  >
                    Model
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                  >
                    Class
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                  >
                    Accuracy
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                  >
                    Precision
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                  >
                    Recall
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                  >
                    F1-Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  {
                    model: "Decision Tree",
                    class: "0",
                    accuracy: "0.70",
                    precision: "0.95",
                    recall: "0.69",
                    f1: "0.80",
                  },
                  {
                    model: "",
                    class: "1",
                    accuracy: "",
                    precision: "0.28",
                    recall: "0.75",
                    f1: "0.41",
                  },
                  {
                    model: "Decision Tree (One-Hot Encoded)",
                    class: "0",
                    accuracy: "0.71",
                    precision: "0.94",
                    recall: "0.71",
                    f1: "0.81",
                  },
                  {
                    model: "",
                    class: "1",
                    accuracy: "",
                    precision: "0.29",
                    recall: "0.72",
                    f1: "0.41",
                  },
                  {
                    model: "Random Forest",
                    class: "0",
                    accuracy: "0.71",
                    precision: "0.93",
                    recall: "0.72",
                    f1: "0.81",
                  },
                  {
                    model: "",
                    class: "1",
                    accuracy: "",
                    precision: "0.28",
                    recall: "0.68",
                    f1: "0.39",
                  },
                  {
                    model: "XGBoost",
                    class: "0",
                    accuracy: "0.59",
                    precision: "0.97",
                    recall: "0.54",
                    f1: "0.69",
                  },
                  {
                    model: "",
                    class: "1",
                    accuracy: "",
                    precision: "0.24",
                    recall: "0.89",
                    f1: "0.37",
                  },
                  {
                    model: "LightGBM",
                    class: "0",
                    accuracy: "0.70",
                    precision: "0.95",
                    recall: "0.69",
                    f1: "0.80",
                  },
                  {
                    model: "",
                    class: "1",
                    accuracy: "",
                    precision: "0.29",
                    recall: "0.77",
                    f1: "0.42",
                  },
                  {
                    model: "Decision Tree (Tuned)",
                    class: "0",
                    accuracy: "0.71",
                    precision: "0.94",
                    recall: "0.71",
                    f1: "0.81",
                  },
                  {
                    model: "",
                    class: "1",
                    accuracy: "",
                    precision: "0.28",
                    recall: "0.70",
                    f1: "0.40",
                  },
                  {
                    model: "XGBoost (RandomSearch)",
                    class: "0",
                    accuracy: "0.60",
                    precision: "0.95",
                    recall: "0.56",
                    f1: "0.71",
                  },
                  {
                    model: "",
                    class: "1",
                    accuracy: "",
                    precision: "0.23",
                    recall: "0.83",
                    f1: "0.36",
                  },
                  {
                    model: "Logistic Regression",
                    class: "0",
                    accuracy: "0.71",
                    precision: "0.95",
                    recall: "0.70",
                    f1: "0.81",
                  },
                  {
                    model: "",
                    class: "1",
                    accuracy: "",
                    precision: "0.29",
                    recall: "0.76",
                    f1: "0.42",
                  },
                  {
                    model: "KNN",
                    class: "0",
                    accuracy: "0.84",
                    precision: "0.89",
                    recall: "0.93",
                    f1: "0.91",
                  },
                  {
                    model: "",
                    class: "1",
                    accuracy: "",
                    precision: "0.36",
                    recall: "0.25",
                    f1: "0.29",
                  },
                ].map((row, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.model}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {row.class}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {row.accuracy && (
                        <span
                          className={
                            row.accuracy === "0.84"
                              ? "font-bold text-green-600"
                              : ""
                          }
                        >
                          {row.accuracy}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={
                          row.precision === "0.97" || row.precision === "0.36"
                            ? "font-bold text-green-600"
                            : ""
                        }
                      >
                        {row.precision}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={
                          row.recall === "0.93" || row.recall === "0.89"
                            ? "font-bold text-green-600"
                            : ""
                        }
                      >
                        {row.recall}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={
                          row.f1 === "0.91" || row.f1 === "0.42"
                            ? "font-bold text-green-600"
                            : ""
                        }
                      >
                        {row.f1}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-6">
          From the table, we can see that{" "}
          <strong>KNN achieved the highest overall accuracy</strong>. However,
          none of the models performed exceptionally well, as there are
          significant differences between precision and recall across classes.
          In particular,{" "}
          <strong>class 1 consistently has very low precision</strong> across
          all model evaluations, indicating poor performance in correctly
          identifying positive cases.
        </p>
        <p className="mt-4">
          After discussing the issue with my supervisor, I explored several
          potential improvements, including:
        </p>
        <ol className="list-decimal pl-6 mt-2">
          <li>Adjusting the train-test split.</li>
          <li>Hyperparameter tuning.</li>
          <li>
            Experimenting with different <strong>SMOTE variations</strong> and
            applying multiple layers of SMOTE to balance the dataset.
          </li>
        </ol>
        <p className="mt-4">
          However, none of these approaches led to a significant improvement in
          model performance. The one area I have yet to explore is{" "}
          <strong>trying different encoding methods</strong>, which might be my
          next step for further optimization. As it stands now, this appears to
          be the best performance achievable with the current approach.
        </p>
      </section>

      {/* Findings Section */}
      <section className="prose lg:prose-xl mb-12">
        <h2 className="text-2xl font-bold mb-4">Findings</h2>
        <p>
          From the <strong>tree-based models</strong>, I analyzed feature
          importance and found that
          <strong> high blood pressure</strong> plays a significant role in
          determining diabetes risk.
        </p>
        <figure className="my-6 p-4">
          <img
            src="/fimp_dt.png"
            alt="Feature Importance Plot of Decision Tree Model showing high blood pressure as the most important factor"
            className="mx-auto max-w-full h-auto"
          />
          <figcaption className="text-center text-gray-600 mt-2 text-sm">
            Feature Importance Plot of Decision Tree Model showing high blood
            pressure as the most important factor
          </figcaption>
        </figure>
        <p>
          Additionally, the <strong>SHAP summary plot</strong> highlights the
          features that have a positive or negative impact on the model's
          predictions.
        </p>
        <figure className="my-6 p-4">
          <img
            src="/shap_xgb.png"
            alt="SHAP Summary Plot of XGB showing feature impacts"
            className="mx-auto max-w-full h-auto"
          />
          <figcaption className="text-center text-gray-600 mt-2 text-sm">
            SHAP Summary Plot of XGB showing feature impacts
          </figcaption>
        </figure>
        <p>
          Perhaps I should consider <strong>tweaking these features</strong>{" "}
          when further optimizing the models to improve performance.
        </p>
      </section>
      {/* Feature Importance Section */}
      <section className="prose lg:prose-xl mb-12">
        <h3 className="text-xl font-semibold mb-4">
          Feature Importance Analysis
        </h3>

        {/* Model Selection */}
        <div className="mb-4">
          <label className="mr-2">Select Model:</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="border rounded p-2"
          >
            {featureImportance &&
              Object.keys(featureImportance).map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
          </select>
        </div>

        {/* Feature Importance Chart */}
        {featureImportance && (
          <div className="h-[500px] bg-white rounded-lg shadow p-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={featureImportance[selectedModel].features.map((feature, index) => ({
                  feature: feature,
                  importance: selectedModel === "LightGBM" 
                    ? featureImportance[selectedModel].importance[index]
                    : featureImportance[selectedModel].importance[index] * 100,
                }))}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  domain={selectedModel === "LightGBM" ? [0, 600] : [0, 100]}
                  label={{ 
                    value: selectedModel === "LightGBM" ? "Split Count" : "Importance (%)", 
                    position: "bottom",
                    offset: 10
                  }}
                />
                <YAxis
                  type="category"
                  dataKey="feature"
                  width={140}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value) => [
                    selectedModel === "LightGBM" 
                      ? value.toFixed(0)
                      : `${value.toFixed(2)}%`,
                    "Importance"
                  ]}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
                <Bar 
                  dataKey="importance" 
                  fill="#8884d8" 
                  radius={[0, 4, 4, 0]}
                >
                  <LabelList
                    dataKey="importance"
                    position="right"
                    formatter={(value) => 
                      selectedModel === "LightGBM" 
                        ? value.toFixed(0)
                        : `${value.toFixed(2)}%`
                    }
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <p className="mt-4">
          This chart shows the relative importance of each feature in predicting
          diabetes risk according to the {selectedModel} model. 
          {selectedModel === "LightGBM" 
            ? " The values represent the number of times each feature was used for splitting in the trees."
            : " Higher percentages indicate stronger influence on the model's predictions."
          }
        </p>
      </section>
      {/* Deployment Section */}
      <section className="prose lg:prose-xl mb-12">
        <h2 className="text-2xl font-bold mb-4">Deployment</h2>
        <p className="mb-2">
          After training multiple models, I wanted to integrate AI into a{" "}
          <strong>real-world application</strong>, as I believe that models are
          only valuable when they have practical use.
        </p>
        <p className="mb-2">
          To begin, I created a prototype using <strong>Streamlit</strong>,
          which allowed for quick deployment with minimal coding and enabled
          easy testing by multiple users.
        </p>
        <p className="mb-2">
          Once the prototype was functional, I took the time to develop a{" "}
          <strong>full-stack application </strong>
          with <strong>Flask</strong> as the backend and{" "}
          <strong>React.js + TailwindCSS</strong> as the frontend for a more
          robust and scalable solution.
        </p>
        <p className="mb-2">
          You can access the <strong>Streamlit prototype</strong> here:
          <a
            href="https://diabetic-doctor-zno.streamlit.app/"
            className="text-indigo-600 hover:text-indigo-800 ml-1"
          >
            Diabetic Doctor
          </a>
        </p>
        <p className="mb-2">
          You can access the <strong>full-stack application</strong> here:
          <a
            href="https://ml-doctor-frontend.onrender.com/"
            className="text-indigo-600 hover:text-indigo-800 ml-1"
          >
            ML Doctor
          </a>
        </p>
        <p>
          <strong>Note</strong>: Since the backend for full-stack application is
          hosted on free server of Render.com, it will take a few minutes to
          load the backend functions especially the diabetes prediction app.
        </p>
      </section>
      <section className="prose lg:prose-xl mb-12">
        <h2 className="text-2xl font-bold mb-4">Conclusion</h2>
        <p>
          This project set out to explore whether machine learning could help
          assess diabetes risk using publicly available health data. While the
          results show promise, it's important to acknowledge both the strengths
          and limitations of our approach.
        </p>

        <h3 className="text-xl font-semibold mt-4">Key Takeaways</h3>
        <ol className="list-decimal pl-6 mb-2">
          <li className="mb-2">
            <strong>Understanding Risk Factors:</strong> Our analysis identified
            key health indicators linked to diabetes risk. While these
            associations align with existing medical knowledge, correlation does
            not imply causation. The predictions should be interpreted
            cautiously, emphasizing the need for expert validation.
          </li>
          <li className="mb-2">
            <strong>Model Performance:</strong> Different machine learning
            models provided varying levels of accuracy and interpretability.
            While some performed well, no model is perfect, and predictions
            should not replace medical advice. This highlights the balance
            between predictive power and real-world applicability.
          </li>
          <li className="mb-2">
            <strong>Practical Applications:</strong> In theory, these models
            could assist in early risk assessment, helping individuals become
            more aware of potential health risks. However, without clinical
            validation, the predictions should be considered informative rather
            than diagnostic.
          </li>
          <li className="mb-2">
            <strong>Future Improvements:</strong> Expanding the dataset,
            improving feature selection, and exploring advanced modeling
            techniques could enhance accuracy. Deploying this model as a web
            application could improve accessibility, but ethical implications
            and user responsibility must also be considered.
          </li>
        </ol>

        <p>
          Ultimately, this project demonstrates that machine learning can
          provide meaningful insights into diabetes risk, but it is not a
          substitute for professional medical assessment. Instead, it serves as
          a step toward understanding how data science can support, rather than
          replace, human expertise in healthcare.
        </p>
      </section>
    </div>
  );
}
