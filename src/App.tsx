import * as React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { sampleList, ListItemType } from './state';
import { useResponsive } from './hooks/responsive';

/**
 * global style
 **/
const GlobalStyle = createGlobalStyle`
  * {
   box-sizing: border-box;
  }
`

/**
 * container component of list items
 **/
declare type ContainerPropsType = {
  width?: number
}

const Container = styled.div`
  //width: ${(props: ContainerPropsType) => props.width}px;
  width: 100vw;
  padding: 7.5vw;
  padding-top: 0;
  display: flex;
  flex-wrap: nowrap;
  overflow: hidden;
  &:after {
    content: " ";
    padding-right: 7.5vw;
  }
`

/**
 *  list item component
 **/
declare type ListItemPropsType = {
  bcColor: string
  color: string
}


const ListItem = styled.a`
  
  display: block;
  flex: 0 0 80vw;
  margin: 0 2.5vw;

  background-color: ${(props: ListItemPropsType) => props.bcColor};
  color: ${(props: ListItemPropsType) => props.color};

  text-align: center;
  box-shadow: 0px 0px 10px 3px grey;
  border-radius: 5px;

  & img {
    width: 100%;
    border-radius: 5px;
    border-radius: 5px 5px 0 0;
  }

  & .list-item-desc {
    padding: 0 10px;
  }

  & .list-item-date {
    padding: 10px 0;
  }
`


/**
 * indicator container component
 **/
const IndicatorContainer = styled.ul`

  display: block;
  list-style-type: none;
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 0;
  text-align: center;
  padding: 10px 0;
`

/**
 * indicator component
 **/
declare type IndicatorPropsType = {
  active: boolean
}

const Indicator = styled.li`
  display: inline-block;
  width: 20px;
  height: 10px;
  background-color: ${(props: IndicatorPropsType) => props.active ? "black" : "grey"};
  margin 3px;
  border-radius: 3px;
`

declare type TouchStartState = {
  x: number,
  y: number,
}


const App: React.FunctionComponent<{}> = (props) => {

  /**
   * current selected list item id
   **/
  const [curSelectedListItemId, setSelectedListItemId] = React.useState<number>(0)

  /**
   * responsive
   *
   *  - show this when mobile screen size
   *  - get current screen width to calculate the unit movement when swiping 
   **/
  const responsive = useResponsive()

  /**
   * screen touch left/right feature
   *
   * - when users swipe the element left/right, move cur pos to the next list itme.
   *
   **/

  const unitMovementPercentage = 0.85

  // list box callback ref to calculate its width
  const boxSizeRef = React.useRef<HTMLDivElement>()
  const boxSizeCallbackRef = React.useCallback((node: HTMLDivElement) => {
    if (node != null) {
      boxSizeRef.current = node
    }
  }, []);

  // keep the touch start position
  const curTouchStart = React.useRef<TouchStartState>({ x: 0, y: 0 })

  // touch start event handler
  const handleTouchStartEventHandler: React.EventHandler<React.TouchEvent<HTMLDivElement>> = (e) => {
    if (curTouchStart.current) {
      curTouchStart.current.x = e.touches[0].clientX
      curTouchStart.current.y = e.touches[0].clientY
    }
  }

  // touch move event handler: decide if it is left/right move
  const handleTouchMoveEventHandler: React.EventHandler<React.TouchEvent<HTMLDivElement>> = (e) => {

    if (!curTouchStart.current) return false

    /**
     * safari and IE does not support 'changedTouches'
     *  - ref: https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/changedTouches
     **/
    const curMoveX = e.changedTouches[0].clientX
    //const curMoveY = e.touches[0].clientY
    //
    const unitMoveX = responsive.currentScreenWidth * unitMovementPercentage

    /**
     * add extra condition 'curSelectedListItemId != 0'
     *
     *  - to avoid this state from increment/decrement more than the size of list
     *
     **/
    if (curMoveX > curTouchStart.current.x && curSelectedListItemId != 0) {
      setSelectedListItemId((prev: number) => prev - 1)
      const nextScrollPos = e.currentTarget.scrollLeft - unitMoveX
      e.currentTarget.scrollTo({
        behavior: "smooth",
        left: nextScrollPos,
      })
    } else if (curMoveX < curTouchStart.current.x && curSelectedListItemId != (sampleList.length - 1)) {
      const nextScrollPos = e.currentTarget.scrollLeft + unitMoveX
      setSelectedListItemId((prev: number) => prev + 1)
      e.currentTarget.scrollTo({
        behavior: "smooth",
        left: nextScrollPos,
      })
    } else {
    }
  }

  /**
   *
   * indicators features
   *
   *  - when click an indicator, move to the corresponding list item.
   *
   **/
  const handleIndicatorClickEvent: React.EventHandler<React.MouseEvent<HTMLLIElement>> = (e) => {

    if (!boxSizeRef.current) return false

    const targetId = Number(e.currentTarget.getAttribute("data-id"))
    const unitMoveX = responsive.currentScreenWidth * unitMovementPercentage 
    const nextMoveX = unitMoveX * (targetId - curSelectedListItemId)

    boxSizeRef.current.scrollTo({
      behavior: "smooth",
      left: boxSizeRef.current.scrollLeft + nextMoveX,
    })

    setSelectedListItemId((prev: number) => targetId)
  }


  /**
   * indicator list item render function
   **/
  const renderIndicatorComponents: () => React.ReactNode = () => {
    return sampleList.map((listItem: ListItemType, index: number) => {
      return (
        <Indicator
          key={index}
          data-id={index}
          onClick={handleIndicatorClickEvent}
          active={curSelectedListItemId == index}
        >
        </Indicator>
      )
    })
  }

  /**
   * list item render function
   **/
  const dateOption = { year: 'numeric', month: 'long', day: 'numeric' };
  const renderListItemComponent: () => React.ReactNode = () => {
    return sampleList.map((listItem: ListItemType, index: number) => (
      <ListItem key={index} bcColor={listItem.bcColor} color={listItem.color}>
        <img src={listItem.imageSrc} alt={`sample list item ${index + 1}`} />
        <h3>{listItem.title}</h3>
        <div className="list-item-desc">{listItem.desc}</div>
        <div className="list-item-date">{listItem.date.toLocaleString("en-US", dateOption)}</div>
      </ListItem>
    ))
  }

  return (
    <div>
      <GlobalStyle />
      {(responsive.isMobileL && /** display only when mobile screen size **/
        <React.Fragment>
          <IndicatorContainer
          >
            {renderIndicatorComponents()}
          </IndicatorContainer>
          <Container
            onTouchStart={handleTouchStartEventHandler}
            onTouchEnd={handleTouchMoveEventHandler}
            ref={boxSizeCallbackRef}
          >
            {renderListItemComponent()}
          </Container>
        </React.Fragment>
      )}
      {(!responsive.isMobileL &&  /** otherwise, show the message **/
        <p>Please adjust screen size to be mobile size</p>
      )}
    </div>
  )
}


export default App;
