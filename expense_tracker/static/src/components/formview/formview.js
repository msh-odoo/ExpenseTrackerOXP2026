import { Component, useRef, proxy, props, onMounted } from '@expense_tracker/owl';

// Note: MSH: Why use proxy against signal while signal provides signal.object, well signal object is proxified but it is not nested proxified, meaning that if we change a property of an object inside the signal it won't trigger the signal invalidation, while with proxy it will trigger it as the whole object is proxified. So in cases where we have nested objects and we want to trigger invalidation on change of any property of the object, we can use proxy directly without needing to use signal.object everywhere in the code. This is the case for form view where we have a record object with multiple properties and we want to trigger invalidation on change of any of these properties.
// Since manipulating collections of elements is a very common need, we introduce four functions that basically wrap the target array, object, set or map in a proxy (but not a nested proxy like the proxy function). This is useful so we can properly invalidate the signal whenever the content has changed.

export class FormView extends Component {
    static template = "expense_tracker.FormView";
    props = props({});
    setup() {
        this.formElement = useRef("formElement");
        super.setup();
        const { record } = this.props.data;
        this.state = proxy({ data: record });
        this.record = Object.keys(record).filter(key => key !== 'id');

        onMounted(() => {
            this.formElement.el.querySelector("input.form-control").focus();
        })
    }
}
