import Container from '../mixins/draggableContainer';

import DragDrop from '../draggable/dragDrop';

import Col from './col';
import Row from './row';
import Form from './form';
import Datagrid from './datagrid';
import LabeledTextbox from './labeledTextbox';
import LabeledRadio from './labeledRadio';
import LabeledCheckbox from './labeledCheckbox';
import LabeledCombobox from './labeledCombobox';
import LabeledDatebox from './labeledDatebox';
import LabeledDateboxRange from './labeledDateboxRange';

import Alert from '../common/alert';

const form = {
  Form: Form,
  // Col: Col,
  Row: Row,

  Datagrid: Datagrid(Container),

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
