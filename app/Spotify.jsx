import "./Spotify.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import {} from "react-bootstrap";
import { useState, useEffect } from "react";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Row,
  Card,
  ToggleButtonGroup,
  ToggleButton,
} from "react-bootstrap";

const CLIENT_ID = "3c17ce18bc734b89bd2caa4b9b57b0ea";
const CLIENT_SECRET = "68a91a4502094a2d80d4a82bb135e9f0";

function Spotify() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);
  const [name, setName] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [searchType, setSearchType] = useState("");
  const [artistPic, setArtistPic] = useState("");
  const [artistName, setArtistName] = useState("");
  const [searched, setSearched] = useState("");

  const handleSelection1 = (option) => {
    setAlbums([]);
    setSearched("");
    if (selectedOption === "option1") {
      setSelectedOption(null);
    } else {
      setSelectedOption(option);
      setSearchType("/albums?include_groups=album&market=US&limit=50");
    }
  };

  const handleSelection2 = (option) => {
    setAlbums([]);
    setSearched("");
    if (selectedOption === "option2") {
      setSelectedOption(null);
    } else {
      setSelectedOption(option);
      setSearchType(`/top-tracks?market=US`)
    }
  };

  useEffect(() => {
    // API Acess Token
    var authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET,
    };
    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((result) => result.json())
      .then(
        (data) => setAccessToken(data.access_token),
        setSearchType("/albums?include_groups=album&market=US&limit=50")
      );
  }, []);

  async function searchArtist() {
    setAlbums([]);
    // Get request using search to get Artist ID
    var searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };
    var artistID = await fetch(
      "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        return data.artists.items[0].id;
      });

    // Get request with Artist ID grab all the albums from that artist
    await fetch(
      "https://api.spotify.com/v1/artists/" + artistID,
      // change this for search line
      searchParameters
    ) // album,sinle gets more stuff
      .then((response) => response.json())
      .then((data) => {
        setName(data.name);
        setArtistPic(data.images[0].url);
        setAlbums([]);
        setSearched("searched");
      });
    // Display those albums to the user
  }

  async function search() {
    setAlbums([]);
    // Get request using search to get Artist ID
    var searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };
    var artistID = await fetch(
      "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        return data.artists.items[0].id;
      });

    // Get request with Artist ID grab all the albums from that artist
    await fetch(
      "https://api.spotify.com/v1/artists/" +
        artistID +
        searchType,
      searchParameters
    ) // album,sinle gets more stuff
      .then((response) => response.json())
      .then((data) => {
        if (searchType === "/top-tracks?market=US") {
          setAlbums(data.tracks);
          setName(data.tracks[0].artists[0].name);
        } else {
          setName(data.items[0].artists[0].name);
          setAlbums(data.items);
        }
        setArtistPic("");
        setArtistName("");
        setSearched("searched");
      });
    // Display those albums to the user
  }

  return (
    // console.log(name),
    // console.log(albums),
    <div className="App">
      <Container>
        <br></br>
        <h1
          style={{
            color: "#1ab26b",
            fontWeight: "550",
            paddingRight: "10px",
          }}
        >
          <img
            src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_Green-768x231.png"
            alt="Spotify"
            className="img-fluid"
            width="200"
            style={{ marginBottom: "10px" }}
          />{" "}
          Search
        </h1>

        <ToggleButtonGroup
          type="radio"
          name="options"
          defaultValue={null}
          allowUnselect
        >
          <ToggleButton
            id="option1"
            value="option1"
            variant="light"
            style={{
              backgroundColor: selectedOption === "option1" ? "#1ab26b" : "white",
              color: selectedOption === "option1" ? "white" : "black",
              border: "1px solid black",
            }}
            onClick={() => handleSelection1("option1")}
          >
            Albums
          </ToggleButton>
          <ToggleButton
            id="option2"
            value="option2"
            variant="light"
            style={{
              backgroundColor: selectedOption === "option2" ? "#1ab26b" : "white",
              color: selectedOption === "option2" ? "white" : "black",
              border: "1px solid black",
            }}
            onClick={() => handleSelection2("option2")}
          >
            Top Songs
          </ToggleButton>
        </ToggleButtonGroup>

        <Container style={{ margin: "20px 0" }}></Container>

        <InputGroup className="mb-3" size="lg">
          <FormControl
            placeholder="Search By Artist"
            type="input"
            onKeyDown={(event) => {
              setAlbums([]);
              setSearched("");
              if (
                event.key === "Enter" &&
                event.target.value !== "" &&
                selectedOption != null
              ) {
                search();
              } else if (event.key === "Enter" && event.target.value !== "") {
                searchArtist();
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Button
            onClick={() => {
              if (searchInput !== "" && selectedOption != null) {
                search();
              } else if (searchInput !== "") {
                searchArtist();
              }
            }}
          >
            Search
          </Button>
        </InputGroup>
      </Container>
      {selectedOption === "option1" ? (
      <Container>
        <p>{(name !== "" && selectedOption !== null && searched !== "" ? "Showing albums by " + name : "")}</p>
        <Row className="mx-2 row row-cols-4">
          {albums.map((album, i) => {
            return (
              <Card>
                <Card.Img src={album.images[0].url} />
                <Card.Body>
                  <Card.Title>{album.name}</Card.Title>
                </Card.Body>
              </Card>
            );
          })}
        </Row>
      </Container>) : null}

      {selectedOption === "option2" ? (
      <Container>
        <p>{(name !== "" && selectedOption !== null && searched !== "" ? "Showing top songs by " + name : "")}</p>
        <Row className="mx-2 row row-cols-4">
          {albums.map((album, i) => {
            return (
              <Card>
                <Card.Img src={album.album.images[0].url} />
                <Card.Body>
                  <Card.Title>{album.name}</Card.Title>
                </Card.Body>
              </Card>
            );
          })}
        </Row>
      </Container>) : null}
      
      {(searchInput !== "" && selectedOption === null && { artistPic } != ""  && searched !== "")? (
        <Container>
          <p>{name}</p>
          <Card style={{ border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Card.Img src={artistPic} style={{ width: '400px', height: '400px', objectFit: 'cover' }}/>
            <Card.Body>
              <Card.Title>{artistName}</Card.Title>
            </Card.Body>
          </Card>
        </Container>
      ) : (
        ""
      )}
    </div>
  );
}

export default Spotify;
