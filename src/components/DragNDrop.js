import React, {useState, useRef, useEffect} from 'react'

function DragNDrop({...props}) {
    const {data, shuffleData} = props;
    
    /** Setting State variables, the current "list" variable */
    const [list, setList] = useState(data); 
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
        setList(data);
    }, [setList, data])

    /** value will hold on render */
    const dragItem = useRef();
    const dragItemNode = useRef();
    
    /** Event fired when we start to move the draggable item */
    const handletDragStart = (e, item) => {

        dragItemNode.current = e.target;
        dragItemNode.current.addEventListener('dragend', handleDragEnd)
        dragItem.current = item;
        setDragging(true);   
    }

    /** Event fired when our item is over another item - shuffle the "list" */
    const handleDragEnter = (e, targetItem) => {
        if (dragItemNode.current !== e.target) {
            /** Target and item will not be same , then only swap */
            
            setList(oldList => {
                let newList = JSON.parse(JSON.stringify(oldList))
                newList.Checks.splice(targetItem.itemI, 0, newList.Checks.splice(dragItem.current.itemI,1)[0])
                dragItem.current = targetItem;
                return newList
            });
        }
    }

    /** Calling the callback function to Parent to update our single source of truth 
     *  with the shuffled data on "list" variable change
     * */
    useEffect(() => {
        shuffleData(list)        
        // eslint-disable-next-line
    }, [list]);

    /** Event fired when we leave/end the drag of an item */
    const handleDragEnd = (e) => {
        setDragging(false);
        dragItem.current = null;
        dragItemNode.current.removeEventListener('dragend', handleDragEnd)
        dragItemNode.current = null;
    }

    /** Differentiate between current item being dragged and other items */
    const getStyles = (item) => {
        if (dragItem.current.itemI === item.itemI) {
            return "drag-item current"
        }
        return "drag-item"
    }

    /** Checkbox update - setting the "list" variable with changed data */
    const changeHandler = (item,list) => {

        let updateChecklist = list.Checks.map((oldItem)=> {
            if(oldItem.value === item.value)
            return {
                ...oldItem,
                check: !oldItem.check
            }
            else
                return oldItem
        });
        setList({...list, Checks: updateChecklist});
    }

    if (list && list.Checks) {
        return (                
            <div className="drag-n-drop">
                {/* Cards or items which are draggable */}
                {list.Checks.map((item, itemI) => (
                  <div draggable 
                  key={item.value}  
                  onDragStart={(e) => handletDragStart(e, {itemI})} 
                  onDragEnter={dragging?(e) => {handleDragEnter(e, {itemI})}:null} 
                  className={dragging?getStyles({itemI}):"drag-item"}>
                    <input
                        type="checkbox"
                        checked={item.check}
                        onChange={() => changeHandler(item,list)}
                    />
                    {item.value}
                  </div>
                ))}
            
            </div>
        )
    } else {return null}

}

export default DragNDrop;