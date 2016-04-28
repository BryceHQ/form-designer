import Col from './col';
import Row from './row';
import Form from './form';
import LabeledInput, {options as labeledInputOptions} from './labeledInput';
import LabeledRadio, {options as labeledRadioOptions} from './labeledRadio';
import LabeledCheckbox, {options as labeledCheckboxOptions} from './labeledCheckbox';
import LabeledCombobox, {options as labeledComboboxOptions} from './labeledCombobox';

import Alert from '../common/alert';

import Drop from '../draggable/drop';
import Drag from '../draggable/drag';
import DragDrop from '../draggable/dragDrop';

const form = {
  Form: Form,
  Col: Col,
  Row: Row,

  LabeledInput: LabeledInput,
  LabeledRadio: LabeledRadio,
  LabeledCheckbox: LabeledCheckbox,
  LabeledCombobox: LabeledCombobox,

  Alert: Alert,
  Drop: Drop,
  Drag: Drag,
  DragDrop: DragDrop,
};

export default form;

const options = {
  labeledInput: labeledInputOptions,
  labeledRadio: labeledRadioOptions,
  labeledCheckbox: labeledCheckboxOptions,
  labeledCombobox: labeledComboboxOptions,
};

export {options};
