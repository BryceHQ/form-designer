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

import Drop from '../draggable/drop';
import Drag from '../draggable/drag';
import DragDrop from '../draggable/dragDrop';

const form = {
  Form: Form,
  Col: Col,
  Row: Row,

  LabeledTextbox: LabeledTextbox,
  LabeledRadio: LabeledRadio,
  LabeledCheckbox: LabeledCheckbox,
  LabeledCombobox: LabeledCombobox,
  LabeledDatebox: LabeledDatebox,
  LabeledDateboxRange: LabeledDateboxRange,

  Alert: Alert,
  Drop: Drop,
  Drag: Drag,
  DragDrop: DragDrop,
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
