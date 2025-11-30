import React, { useState, useRef, useEffect } from 'react';

const AutocompleteInput = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    suggestions = []
}) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const wrapperRef = useRef(null);

    useEffect(() => {
        // Filter suggestions based on input value
        if (value) {
            const filtered = suggestions.filter(item =>
                item.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredSuggestions(filtered);
        } else {
            setFilteredSuggestions(suggestions);
        }
    }, [value, suggestions]);

    useEffect(() => {
        // Close dropdown when clicking outside
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        onChange(e);
        setShowSuggestions(true);
    };

    const handleSuggestionClick = (suggestion) => {
        onChange({ target: { name, value: suggestion } });
        setShowSuggestions(false);
    };

    const handleFocus = () => {
        setShowSuggestions(true);
    };

    return (
        <div className="filter-group" ref={wrapperRef}>
            <label htmlFor={name} className="filter-label">
                {label}
            </label>
            <div className="autocomplete-wrapper">
                <input
                    type="text"
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    placeholder={placeholder}
                    className="filter-input"
                    autoComplete="off"
                />
                {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="autocomplete-dropdown">
                        {filteredSuggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className="autocomplete-item"
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                {suggestion}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AutocompleteInput;
