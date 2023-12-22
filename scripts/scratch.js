const encodedParameterData = parameters.data;
const decodedData = encodedParameterData
  ? convertAndParse(encodedParameterData)
  : undefined;

const [instrument, updateInstrument] = useState(null);

const get = () => decodedData;

const [instruments, setInstruments] = useState([]);

const [selectedInstrument, setSelectedInstrument] = useState({
  name: "",
  items: [],
});

const mountInstruments = () => {
  getAssessments(props.http, props.surveyListUrl).then((x) =>
    setInstruments(x)
  );
};

useEffect(mountInstruments, []);

const [graphTitle, updateTitle] = useState(
  ((decodedData || {}).metadata || { name: undefined }).name ||
    "Instrument Chart"
);

const navigate = useNavigate();

const updateState = (newKeyValue) => {
  navigate(convertForUrl(newKeyValue), { replace: false });
};

const boundUpdateComparisonName = updateComparisonName.bind({
  updateSystem: updateTitle,
  save: updateState,
  get,
});

const updateUrlData = (e) => updateUrl(e.target.value);
const metricsData = createDashboardDataset(decodedData); //hERE
const graphData = {
  labels: metricsData.labels,
  datasets: metricsData.datasets,
};

const data = createDatasets(null);
const getInstrumentData = (e) => {
  const fileName = e.target.value;
  getInstrument(http, fileName).then((x) => setSelectedInstrument(x));
};

function updateComparisonName(event) {
  const name = event.target.value;
  const data = this.get();

  const updatedData = { ...data, metadata: { name } };
  this.save(updatedData);
  this.updateSystem(name);
}

function createDashboardDataset(data) {
  return {
    labels: [],
    datasets: [],
    data: [],
  };
}

const chartOptions = {
  type: "line",
  data: data,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Chart.js Line Chart",
      },
    },
  },
};

const saveSelectedInstrument = (e) => {
  const file = e.target.value;
  const update = updateDataObject(get() || {}, "selectedInstrumentFile", file);

  updateState(update);
};

const selectedInstrumentFile = get().selectedInstrumentFile;
if (!instrument && selectedInstrumentFile) {
  getInstrument(http, selectedInstrumentFile).then((x) => update(x));
}
