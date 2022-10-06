import React from 'react';
import Select from 'react-select';

export default class SelectSubType extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFromPlace: {
                code: 'Не выбрано',
                description: null,
            },
        };
    }

    selectHandle = value => {
        this.setState({
            selectedFromPlace: value,
        });
        if (value.code !== 'Не выбрано') {
            this.props.change('subtype', value.code);
        } else {
            this.props.change('subtype', '');
        }
    };

    render() {
        return (
            <>
                <Select
                    onChange={value => {
                        this.selectHandle(value);
                    }}
                    className="correction-sel"
                    classNamePrefix="correction-sel"
                    defaultValue={
                        this.props.value
                            ? {
                                  code: this.props.value,
                                  description: null,
                              }
                            : this.state.selectedFromPlace
                    }
                    options={this.props.options}
                    getOptionLabel={option => {
                        return (
                            <div className="correction-select">
                                <div className="correction-select__title">
                                    {option.code}
                                </div>
                                <div className="correction-select__desc">
                                    {option.description}
                                </div>
                            </div>
                        );
                    }}
                    getOptionValue={option => option.code}
                />
            </>
        );
    }
}
