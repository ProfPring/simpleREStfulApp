import { IColour } from '../people/interfaces/icolour';

export class ColourNamesValueConverter {

  toView(colours: IColour[]) {

    // TODO: Step 4
    //
    // Implement the value converter function.
    // Using the colours parameter, convert the list into a comma
    // separated string of colour names. The names should be sorted
    // alphabetically and there should not be a trailing comma.
    //
    // Example: 'Blue, Green, Red'

      const temp = [];

      //for all colours in colour list add to temp array
      for (const colour of colours){
          temp.push(colour.name);
      }
      //sort temp and separate string with comma
      temp.sort();
      temp.join(",");
      const sortedColours = temp.toString();

      return sortedColours;
  }
}
