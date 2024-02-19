"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "../components/card";
import { Navigation } from "../components/nav";
import { Button, Modal as FlowbiteModal } from "flowbite-react";
import DataTable from "react-data-table-component";
import "react-multi-carousel/lib/styles.css";

interface Movie {
  title: string;
  release_date: string;
  popularity: number;
  vote_average: number;
  overview: string;
}

const MoviePage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          "https://api.themoviedb.org/3/movie/now_playing",
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYjBjN2FkNDgzZDk3NmQxODI4ZjIwZTdmNjE3ZjNiZSIsInN1YiI6IjY1Y2JhODk4NmRjNTA3MDE3Y2IyOWRkOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hvYShjIijfqnOFqpwenld8MN37jEyq5n9Iz0L-kWl20",
            },
          }
        );
        const data = await response.json();
        setMovies(data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  const columns = [
    { name: "Title", selector: (row: Movie) => row.title },
    { name: "Release Date", selector: (row: Movie) => row.release_date },
    { name: "Popularity", selector: (row: Movie) => row.popularity },
    { name: "Rating", selector: (row: Movie) => row.vote_average },
  ];

  const handleRowClick = (row: Movie) => {
    setSelectedMovie(row);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedMovie(null);
  };

  return (
    <div className="bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
      <Navigation />

      <div className="container flex items-center justify-center min-h-screen px-4 mx-auto">
        <div className="grid w-full grid-cols-1 gap-8 mx-auto mt-8 sm:mt-0 sm:grid-cols-1 lg:gap-16">
          <DataTable
            columns={columns}
            data={movies}
            pagination
            paginationPerPage={30} // Set a smaller value for fewer rows per page
            paginationRowsPerPageOptions={[30, 60, 90]} // Set available options
            defaultSortFieldId="popularity"
            sortIcon={<></>}
            onRowClicked={handleRowClick}
            responsive // Enable responsiveness
            noHeader // Hide the table header
            dense // Make the table denser
            paginationComponentOptions={{
              rowsPerPageText: "Rows per page:",
              rangeSeparatorText: "of",
              noRowsPerPage: false,
              selectAllRowsItem: false,
              selectAllRowsItemText: "All",
            }}
          />
          {selectedMovie && (
            <FlowbiteModal show={openModal} onClose={handleCloseModal}>
              <FlowbiteModal.Header>{selectedMovie.title}</FlowbiteModal.Header>
              <FlowbiteModal.Body>
                <p>Synopsis: {selectedMovie.overview}</p>
                <p>Release Date: {selectedMovie.release_date}</p>
                <p>Cast: {/* Include cast information here */}</p>
              </FlowbiteModal.Body>
              <FlowbiteModal.Footer>
                <Button onClick={handleCloseModal}>Close</Button>
              </FlowbiteModal.Footer>
            </FlowbiteModal>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
