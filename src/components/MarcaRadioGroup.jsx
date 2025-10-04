import { RadioGroup, RadioOption, RadioInput, RadioLabel } from './radioStyles';

const MarcaRadioGroup = ({ optionMarca, setOptionMarca }) => {
  return (
    <RadioGroup>
      <RadioOption>
        <RadioInput
          type="radio"
          id="ninguna"
          name="marca"
          value="Ninguna"
          checked={optionMarca === 'Ninguna'}
          onChange={(e) => setOptionMarca(e.target.value)}
        />
        <RadioLabel htmlFor="ninguna">Sin marca</RadioLabel>
      </RadioOption>

      <RadioOption>
        <RadioInput
          type="radio"
          id="nueva"
          name="marca"
          value="Nueva"
          checked={optionMarca === 'Nueva'}
          onChange={(e) => setOptionMarca(e.target.value)}
        />
        <RadioLabel htmlFor="nueva">Nueva marca</RadioLabel>
      </RadioOption>

      <RadioOption>
        <RadioInput
          type="radio"
          id="elegir"
          name="marca"
          value="Elegir"
          checked={optionMarca === 'Elegir'}
          onChange={(e) => setOptionMarca(e.target.value)}
        />
        <RadioLabel htmlFor="elegir">Elegir una marca</RadioLabel>
      </RadioOption>
    </RadioGroup>
  );
};

export default MarcaRadioGroup;