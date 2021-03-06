import React from "react";
import styled from "styled-components";
import { compose, withProps, withStateHandlers, withHandlers } from "recompose";

import data from "../../data";

import FilterIcon from "@material-ui/icons/FilterList";
import CloseIcon from "@material-ui/icons/Close";

import HotelBox from "./HotelBox";
import Filters from "./Filters";
import { withUrlState } from "with-url-state";

const SearchResultPage = ({ hotels, isFilterBarOpen, toggleFilterBar, filters, onFiltersChange }) => (
  <Container>
    <Header>
      <FiltersButton onClick={toggleFilterBar}>
        Filters <FilterIcon />
      </FiltersButton>
    </Header>
    <Content>
      <Sidebar open={isFilterBarOpen}>
        <SidebarTitle>
          Filters
          <CloseButton onClick={toggleFilterBar}>
            <CloseIcon fontSize="inherit" />
          </CloseButton>
        </SidebarTitle>
        <Filters filters={filters} onChange={onFiltersChange} />
      </Sidebar>
      <HotelList>
        {hotels.length === 0 && (
          <EmptyMsg>No results</EmptyMsg>
        )}
        {hotels.map((hotel, index) => (
          <HotelBox key={index} hotel={hotel} />
        ))}
      </HotelList>
    </Content>
  </Container>
);

const filterByStars = (stars) => (hotels) =>
  stars > 1 ? hotels.filter(hotel => +hotel.rate >= stars) : hotels;

const filterByName = (nameSubstr) => (hotels) =>
  nameSubstr.length > 0 ? hotels.filter(hotel => hotel.name.toLowerCase().indexOf(nameSubstr) >= 0) : hotels;

const filterByPool = (hasPool) => (hotels) =>
  hasPool ? hotels.filter(hotel => hotel.hasPool === "true") : hotels;

const enhance = compose(
  withUrlState(props => ({})),
  withProps(({ urlState }) => ({
    filters: {
      stars: urlState.stars ? +urlState.stars : 1,
      name: urlState.name || '',
      hasPool: urlState.hasPool === 'true',
    }
  })),
  withStateHandlers(
    {
      isFilterBarOpen: false,
    },
    {
      toggleFilterBar: ({ isFilterBarOpen }) => () => ({
        isFilterBarOpen: !isFilterBarOpen
      }),
    }
  ),
  withProps(({ filters }) => ({
    hotels: compose(
      filterByStars(filters.stars),
      filterByName(filters.name.toLowerCase()),
      filterByPool(filters.hasPool),
    )(data.hotels)
  })),
  withHandlers({
    onFiltersChange: ({ urlState, setUrlState }) => (update) => setUrlState({ ...urlState, ...update }),
  }),
);

export default enhance(SearchResultPage);

const Container = styled.div`
  position: relative;
  background-color: #f7f8f9;
  min-height: 100vh;
`;

const Content = styled.div`
  display: flex;
  padding: 1rem;
`;

const Header = styled.div`
  padding: 0.75rem 0.75rem 0;

  @media (min-width: 1024px) {
    display: none;
  }
`;

const HotelList = styled.div`
  flex: 1 1 auto;
`;

const EmptyMsg = styled.div`
  text-align: center;
`;

const FiltersButton = styled.button`
  display: inline-flex;
  align-items: center;
  border: 2px solid #515355;
  border-radius: 0.5rem;
  background: none transparent;
  font-size: 1rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;

  &:focus {
    outline: 0 none;
  }

  &:hover {
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  }

  svg {
    margin-left: 0.25rem;
  }
`;

const Sidebar = styled.div`
  flex: 0 0 15rem;
  margin-right: 1rem;

  @media (max-width: 1023px) {
    position: absolute;
    top: 0;
    right: 100%;
    bottom: 0;
    margin-right: 0;
    padding: 1rem;
    background-color: #f7f8f9;
    border-right: 1px solid #e1e2e3;
    box-shadow: 0 0 ${p => (p.open ? "8px" : "0")} rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease-in;
    transform: translateX(${p => (p.open ? "100%" : "0")});
  }
`;

const SidebarTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding-bottom: 0.5rem;
  margin-bottom: 1rem;

  border-bottom: 1px solid #eaeaea;
  font-size: 1.5rem;
  font-weight: bold;

  @media (min-width: 1024px) {
    display: none;
  }
`;

const CloseButton = styled.button`
  border: 0 none;
  background: transparent none;
  padding: 0;
  cursor: pointer;

  font-size: 1.5rem;

  &:focus {
    outline: 0 none;
  }

  svg {
    display: block;
  }
`;
