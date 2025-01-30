import PatientForm from "./components/PatientForm";
import CollectionForm from "./components/CollectionForm";
import OverdueList from "./components/OverdueList";
import PatientList from "./components/PatientList";
function Home() {
    return (
      <div>
        <h1>ARV Collection Tracking</h1>
        <PatientForm />
        <PatientList />
        <CollectionForm />
        <OverdueList />
      </div>
    );
  }
  
  export default Home;
  