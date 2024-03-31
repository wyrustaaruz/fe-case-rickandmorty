import React from 'react';
import './App.css';
import axios from 'axios';
import AsyncSelect from 'react-select/async';
import { FormatOptionLabelMeta } from 'react-select';

interface CharacterI {
  id: number;
  value: number;
  name: string;
  episode: string[];
  image: string;
}

function App() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const loadOptions = async (inputValue: string) => {
    try {
      const response = await axios.get(
        `https://rickandmortyapi.com/api/character/?name=${inputValue}`
      );
      const data = response.data.results.map((character: CharacterI) => {
        return {
          value: character.id,
          name: character.name,
          episode: character.episode,
          image: character.image,
        };
      });
      setError('');
      return data;
    } catch (error: any) {
      setError(error.message);
      console.error('Error fetching characters:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const formatOptionLabel = (
    option: CharacterI,
    input: FormatOptionLabelMeta<CharacterI>
  ) => {
    const index = option.name
      .toLowerCase()
      .indexOf(input.inputValue.toLowerCase());
    if (index === -1) return option.name;
    if (input.context === 'value') return option.name;

    const { name, episode, image } = option;
    const episodeLength = episode?.length || 0;
    return (
      <div className="formatOptionLabelContainer">
        <input
          key={option.value}
          readOnly
          checked={
            input?.selectValue?.filter(
              (selectedObj: CharacterI) => selectedObj.value === option.value
            )?.length > 0 || false
          }
          type="checkbox"
        />
        {image && (
          <img src={image} alt={name} className="formatOptionLabelImage" />
        )}
        <div className="formatOptionLabelContent">
          <span>
            {option.name.slice(0, index)}
            <strong>
              {option.name.slice(index, index + input.inputValue.length)}
            </strong>
            {option.name.slice(index + input.inputValue.length)}
          </span>
          <span className="subContentSpan">{episodeLength || 0} Episodes</span>
        </div>
      </div>
    );
  };

  const customStyles = {
    multiValueLabel: (def: any) => ({
      ...def,
      backgroundColor: '#e2e8f0',
      padding: 5,
    }),
    multiValueRemove: (def: any) => ({
      ...def,
      backgroundColor: '#94a3b8',
      color: '#fff',
      padding: 0,
      alignItems: 'center',
      justifyContent: 'center',
      height: 20,
      width: 20,
      marginTop: 3,
      marginRight: 5,
      borderRadius: 5,
    }),
    menuPortal: (base: any) => ({
      ...base,
      borderRadius: 15,
    }),
    valueContainer: (base: any) => ({
      ...base,
      maxHeight: '65px',
      overflow: 'auto',
    }),
    option: (
      styles: any,
      { isSelected, isFocused }: { isSelected: boolean; isFocused: boolean }
    ) => ({
      ...styles,
      backgroundColor:
        isSelected && !isFocused
          ? null
          : isFocused && !isSelected
          ? styles.backgroundColor
          : isFocused && isSelected
          ? '#DEEBFF'
          : null,
      color: isSelected ? null : null,
      borderBottom: '1px solid #ccc',
    }),
    menu: (def: any) => ({
      ...def,
      zIndex: 9999,
      border: '1px solid #ccc',
      borderRadius: 15,
    }),
  };

  return (
    <div className="App">
      <p>{error}</p>
      <AsyncSelect
        cacheOptions
        styles={customStyles}
        isMulti
        hideSelectedOptions={false}
        closeMenuOnSelect={false}
        isLoading={loading}
        loadOptions={loadOptions}
        defaultOptions
        placeholder="Karakter arayın..."
        formatOptionLabel={formatOptionLabel}
        menuIsOpen
      />
    </div>
  );
}

export default App;
