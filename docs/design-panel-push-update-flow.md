# Design Panel Element Update Data Flow

Below is a rough outline of the data flow following input change updates in the design panel to how they update the element in the top level story provider. Most of this code can be found in `packages/story-editor/src/components/style/designPanel.js` :

```mermaid
flowchart TB
    subgraph story_reducer[story reducer]
        direction LR
        subgraph ACTION
            direction TB
            L[UPDATE_ELEMENTS] --> M[Story Updated]
        end
    end
    subgraph design_panels[StylePanels]
        subgraph design_panel_state[State]
            direction TB
            design_panel_state_el_updates((elementUpdates Array))
            design_panel_state_el_handlers((presubmitHandlers Array))
        end
        subgraph design_panel_callbacks[Callbacks]
            direction LR
            subgraph submit_handler[submit handler]
                subgraph SUBMIT [ ]
                    direction TB
                    E[onSubmit] --> F[[internalSubmit]]
                    F --> G[[apply presubmit element mutations on all staged elementUpdates]]
                    G --> H[[onSetProperties]]
                    H --> I[updateElementsById]
                end
            end
            subgraph submit_event[submit event]
                subgraph DOM EVENT FIRED [ ]
                    direction TB
                    K{Dispatch Event - 'submit'}
                end
            end
            subgraph push_update[pushUpdate called]
                subgraph INPUT ONCHANGE[ ]
                    direction TB
                    A[pushUpdate or pushUpdateForObject] --> |update, submit| B[[setElementUpdates - Add update to update queue]]
                    B -->|submit == false| C[elementUpdates - locally stored updates]
                    B --> |submit == true| D[submit]
                    D --> J[[setTimout to dispatch 'submit' event]]
                end
            end
        end
    end
       push_update .-> submit_event
       submit_event .-> submit_handler
       design_panels .-> story_reducer
```

## Current Usage

Most of the time, we are passing `submit` as `true` for the `pushUpdate(update, submit)` or `pushUpdateForObject(...)` callback args. The current setup is mainly used so the presubmit hooks can alter an update to an element before sending the element updates to the story reducer. Most precommit hooks do things like clamp a value within a certain range, or resize the text element depending on updates to text properties.

