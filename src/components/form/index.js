import Container from '../mixins/draggableContainer';

import DragDrop from '../draggable/dragDrop';

import Col from './col';
import Row from './row';
import Form from './form';
import LabeledTextbox, {options as labeledTextboxOptions} from './labeledTextbox';
import LabeledRadio, {options as labeledRadioOptions} from './labeledRadio';
import LabeledCheckbox, {options as labeledCheckboxOptions} from './labeledCheckbox';
import LabeledCombobox, {options as labeledComboboxOptions} from './labeledCombobox';
import LabeledDatebox, {options as labeledDateboxOptions} from './labeledDatebox';
import LabeledDateboxRange, {options as labeledDateboxRangeOptions} from './labeledDateboxRange';

import Alert from '../common/alert';

const form = {
  Form: Form,
  // Col: Col,
  Row: Row,

  LabeledTextbox: LabeledTextbox(Container),
  LabeledRadio: LabeledRadio(Container),
  LabeledCheckbox: LabeledCheckbox(Container),
  LabeledCombobox: LabeledCombobox(Container),
  LabeledDatebox: LabeledDatebox(Container),
  LabeledDateboxRange: LabeledDateboxRange(Container),

  DragDrop: DragDrop,
  Alert: Alert,
};

export default form;

const options = {
  labeledTextbox: labeledTextboxOptions,
  labeledRadio: labeledRadioOptions,
  labeledCheckbox: labeledCheckboxOptions,
  labeledCombobox: labeledComboboxOptions,
  labeledDatebox: labeledDateboxOptions,
  labeledDateboxRange: labeledDateboxRangeOptions,
};

export {options};
