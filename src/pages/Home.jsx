import pharma from '/public/pharma.jpg';
function Home() {
    return (
      <div>
        <img src={pharma} alt="Pharma" className='pharma'/>
        <h1>ARV Collection Tracking</h1>
        <p>
          Welcome to the ARV Collection Tracking System. Please select an option
          from the navigation bar.
        </p>
      </div>
    );
  }
  
  export default Home;