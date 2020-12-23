import * as React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { sampleList, ListItemType, backgroundColorList } from './state';
import { useResponsive } from './hooks/responsive';
import { useOrientation } from './hooks/orientation';

/**
 * implementation steps
 *
 * 0. prep sample data (don't need to show how to implement)
 * 1. components
 *    Container: 
 *    IndicatorContainer:
 *    Indicator:
 *    ListContainer:
 *    ListItem:
 * 1.1. basic styling
 * 2. states/refs
 * 3. event handlers 
 *  - onTouchStart on ListContainer
 *  - onTouchEnd on ListContainer
 *  - onClick on Indicator
 * 4. wrapping up styling
 *    - Container styling
 * 
 * terms: 
 *  - template literals
 *  - backtick
 *
 *
 **/

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  html {
    text-size-adjust: 100%; /* Prevent font scaling in landscape while allowing user zoom */
  }
`

const Container = styled.div`
  
`

const IndicatorContainer = styled.ul`
    // reset default user agenet style
    list-style-type: none;
    margin-block-start: 0em;
    margin-block-end: 0em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 0px; 
    
`

const Indicator = styled.li`
  display: inline-block;
  width: 20px;
  height: 10px;
  background-color: #000;
  margin: 0 5px;
`

const ListContainer = styled.div`
  width: 100vw; // screen size: responsive.currentScreenWidth
  padding: 0 7.5vw; //(x_cp)
  display: flex;
  flex-wrap: nowrap;
  overflow: hidden;
  &:after {
    content: " ";
    padding-right: 7.5vw;
  }
`

const ListItem = styled.a`
  display: block;
  flex: 0 0 80vw; //(x_e)
  margin: 0 2.5vw; //(x_m)
  background-color: aqua;
  & img {
    width: 100%; 
  }
  
`

const App: React.FunctionComponent<{}> = (props) => {

  // (state) current id of the selected list item: keep track of the id esp indicator feature
  const [curSelectedListItemid, setSelectedListItemId] = React.useState<number>(0)

  // (ref) list container ref: to scroll right/left programmatically
  const listContainerRef = React.useRef<HTMLDivElement>(null)

  // (ref) current position where touch starts
  const curTouchStart = React.useRef<number>(0)

  // responsive hook (custom hook)
  const responsive = useResponsive()

  // unit scroll percentage  = x_cp + x_m + x_e - x_p = 7.5 + 2.5 + 80 - 5.0 = 85%
  let distancePerSwipe = 0.85 * responsive.currentScreenWidth

  const orientation = useOrientation()

  // some mobile browsers can't detect resize event when changing orientation
  // even if this, chrome mobile browser won't detect this orientation change (i think it is a bug)
  React.useEffect(() => {
    distancePerSwipe = 0.85 * responsive.currentScreenWidth
  }, [
    orientation.isOrientationChanged 
  ])

  React.useEffect(() => {

    if (listContainerRef.current) {

      listContainerRef.current.scrollTo({
        behavior: "smooth",
        left: 0, 
      })

      setSelectedListItemId(0)
    }

  }, [
    responsive.currentScreenWidth 
  ])

  // event handler triggered when a user starts touching the screen
  const handleTouchStartEvent: React.EventHandler<React.TouchEvent<HTMLDivElement>> = React.useCallback((e) => {
    curTouchStart.current = e.touches[0].clientX
  }, [
  ])

  // event handler triggered when a user ends touching the screen
  const handleTouchEndEvent: React.EventHandler<React.TouchEvent<HTMLDivElement>> = React.useCallback((e) => {

    // 1. get the position where the user ends touching
    const curTouchEnd = e.changedTouches[0].clientX

    // 2. decide the right/left swipe based on the curTouchStart and curTouchEnd
    if (curTouchEnd > curTouchStart.current && curSelectedListItemid !== 0) {
      // right swipe

      console.log("right")
      // 3. scroll to next position programmatically
      e.currentTarget.scrollTo({
        behavior: "smooth",
        left: e.currentTarget.scrollLeft - distancePerSwipe
      })

      // update curSelectedListItemId
      setSelectedListItemId((prev: number) => prev - 1)

    } else if (curTouchEnd < curTouchStart.current && curSelectedListItemid !== (sampleList.length - 1)) {
      // left swipe
      console.log("left")
      // 3. scroll to next position programmatically
      e.currentTarget.scrollTo({
        behavior: "smooth",
        left: e.currentTarget.scrollLeft + distancePerSwipe
      })

      // update curSelectedListItemId
      setSelectedListItemId((prev: number) => prev + 1)
    }
  }, [
      curSelectedListItemid,
      distancePerSwipe
    ])

  // event handler triggered when the user click an indciator
  const handleIndicatorClickEvent: React.EventHandler<React.MouseEvent<HTMLLIElement>> = React.useCallback((e) => {

    if (!listContainerRef.current) return false

    // 1. get next target id of the list item
    const nextListItemId = Number(e.currentTarget.getAttribute("data-id"))

    console.log(nextListItemId)

    // 2. calculate the distance of this click
    const nextDistance = distancePerSwipe * (nextListItemId - curSelectedListItemid)

    // 3. scroll programmatically
    listContainerRef.current.scrollTo({
      behavior: "smooth",
      left: listContainerRef.current.scrollLeft + nextDistance
    })

    // update curSelectedListItemId
    setSelectedListItemId((prev: number) => nextListItemId)

  }, [
    distancePerSwipe,
    curSelectedListItemid
  ])


  // render function for indicator
  const renderIndicatorComponents: () => React.ReactNode = () => {
    return sampleList.map((listItem: ListItemType, index: number) => (
      <Indicator
        key={index}
        data-id={index}
        onClick={handleIndicatorClickEvent}
      />
    ))
  }

  // render function for list item
  const dateOption = { year: 'numeric', month: 'long', day: 'numeric' };
  const renderListItemComponents: () => React.ReactNode = () => {
    return sampleList.map((listItem: ListItemType, index: number) => (
      <ListItem
        key={index}
      >
        <img src={listItem.imageSrc} alt={`list item ${index}`} />
        <h3>{listItem.title}</h3>
        <p>{listItem.desc}</p>
        <small>{listItem.date.toLocaleString("en-US", dateOption)}</small>
      </ListItem>
    ))
  }

  return (
    <Container>
      <GlobalStyle />
      <IndicatorContainer>
        {renderIndicatorComponents()}
      </IndicatorContainer>
      <ListContainer
        onTouchStart={handleTouchStartEvent}
        onTouchEnd={handleTouchEndEvent}
        ref={listContainerRef}
      >
        {renderListItemComponents()}
      </ListContainer>
    </Container>
  )
}

///**
// * global style
// **/
//const GlobalStyle = createGlobalStyle`
//  * {
//   box-sizing: border-box;
//  }
//`
//
///**
// * container component
// **/
//
//declare type ContainerPropsType = {
//  color: string
//}
//
//const Container = styled.div`
//  background-color: ${(props: ContainerPropsType) => props.color};
//  transition: all 1s;
//  height: 100vh;
//`
//
//
///**
// * container component of list items
// **/
//declare type ListContainerPropsType = {
//  width?: number
//}
//
//const ListContainer = styled.div`
//  //width: ${(props: ListContainerPropsType) => props.width}px;
//  width: 100vw;
//  padding: 7.5vw;
//  padding-top: 0;
//  display: flex;
//  flex-wrap: nowrap;
//  overflow: hidden;
//  &:after {
//    content: " ";
//    padding-right: 7.5vw;
//  }
//`
//
///**
// *  list item component
// **/
//declare type ListItemPropsType = {
//  bcColor: string
//  color: string
//}
//
//
//const ListItem = styled.a`
//  
//  display: block;
//  flex: 0 0 80vw;
//  margin: 0 2.5vw;
//
//  background-color: ${(props: ListItemPropsType) => props.bcColor};
//  color: ${(props: ListItemPropsType) => props.color};
//
//  text-align: center;
//  box-shadow: 0px 0px 10px 3px grey;
//  border-radius: 5px;
//
//  & img {
//    width: 100%;
//    border-radius: 5px;
//    border-radius: 5px 5px 0 0;
//  }
//
//  & .list-item-desc {
//    padding: 0 10px;
//  }
//
//  & .list-item-date {
//    padding: 10px 0;
//  }
//`
//
//
///**
// * indicator container component
// **/
//const IndicatorContainer = styled.ul`
//
//  display: block;
//  list-style-type: none;
//  margin-block-start: 0;
//  margin-block-end: 0;
//  margin-inline-start: 0px;
//  margin-inline-end: 0px;
//  padding-inline-start: 0;
//  text-align: center;
//  padding: 10px 0;
//`
//
///**
// * indicator component
// **/
//declare type IndicatorPropsType = {
//  active: boolean
//}
//
//const Indicator = styled.li`
//  display: inline-block;
//  width: 20px;
//  height: 10px;
//  background-color: ${(props: IndicatorPropsType) => props.active ? "black" : "grey"};
//  margin 3px;
//  border-radius: 3px;
//`
//
//declare type TouchStartState = {
//  x: number,
//  y: number,
//}
//
//
//const App: React.FunctionComponent<{}> = (props) => {
//
//  /**
//   * current selected list item id
//   **/
//  const [curSelectedListItemId, setSelectedListItemId] = React.useState<number>(0)
//
//  /**
//   * responsive
//   *
//   *  - show this when mobile screen size
//   *  - get current screen width to calculate the unit movement when swiping 
//   **/
//  const responsive = useResponsive()
//
//  /**
//   * screen touch left/right feature
//   *
//   * - when users swipe the element left/right, move cur pos to the next list itme.
//   *
//   **/
//
//  const unitMovementPercentage = 0.85
//
//  // 
//  const listContainerRef = React.useRef<HTMLDivElement>(null)
//
//  // keep the touch start position
//  const curTouchStart = React.useRef<TouchStartState>({ x: 0, y: 0 })
//
//  // touch start event handler
//  const handleTouchStartEventHandler: React.EventHandler<React.TouchEvent<HTMLDivElement>> = (e) => {
//    if (curTouchStart.current) {
//      curTouchStart.current.x = e.touches[0].clientX
//      curTouchStart.current.y = e.touches[0].clientY
//    }
//  }
//
//  // touch move event handler: decide if it is left/right move
//  const handleTouchEndEventHandler: React.EventHandler<React.TouchEvent<HTMLDivElement>> = (e) => {
//
//    if (!curTouchStart.current) return false
//
//    /**
//     * safari and IE does not support 'changedTouches'
//     *  - ref: https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/changedTouches
//     *
//     *  - tested on safari. it works!!
//     **/
//    const curMoveX = e.changedTouches[0].clientX
//    //const curMoveY = e.touches[0].clientY
//    //
//    const unitMoveX = responsive.currentScreenWidth * unitMovementPercentage
//
//    /**
//     * add extra condition 'curSelectedListItemId != 0'
//     *
//     *  - to avoid this state from increment/decrement more than the size of list
//     *
//     **/
//    if (curMoveX > curTouchStart.current.x && curSelectedListItemId !== 0) {
//      setSelectedListItemId((prev: number) => prev - 1)
//      const nextScrollPos = e.currentTarget.scrollLeft - unitMoveX
//      e.currentTarget.scrollTo({
//        behavior: "smooth",
//        left: nextScrollPos,
//      })
//    } else if (curMoveX < curTouchStart.current.x && curSelectedListItemId !== (sampleList.length - 1)) {
//      const nextScrollPos = e.currentTarget.scrollLeft + unitMoveX
//      setSelectedListItemId((prev: number) => prev + 1)
//      e.currentTarget.scrollTo({
//        behavior: "smooth",
//        left: nextScrollPos,
//      })
//    } else {
//    }
//  }
//
//  /**
//   *
//   * indicators features
//   *
//   *  - when click an indicator, move to the corresponding list item.
//   *
//   **/
//  const handleIndicatorClickEvent: React.EventHandler<React.MouseEvent<HTMLLIElement>> = (e) => {
//
//    if (!listContainerRef.current) return false
//
//    const targetId = Number(e.currentTarget.getAttribute("data-id"))
//    const unitMoveX = responsive.currentScreenWidth * unitMovementPercentage 
//    const nextMoveX = unitMoveX * (targetId - curSelectedListItemId)
//
//    listContainerRef.current.scrollTo({
//      behavior: "smooth",
//      left: listContainerRef.current.scrollLeft + nextMoveX,
//    })
//
//    setSelectedListItemId((prev: number) => targetId)
//  }
//
//
//  /**
//   * indicator list item render function
//   **/
//  const renderIndicatorComponents: () => React.ReactNode = () => {
//    return sampleList.map((listItem: ListItemType, index: number) => {
//      return (
//        <Indicator
//          key={index}
//          data-id={index}
//          onClick={handleIndicatorClickEvent}
//          active={curSelectedListItemId === index}
//        >
//        </Indicator>
//      )
//    })
//  }
//
//  /**
//   * list item render function
//   **/
//  const dateOption = { year: 'numeric', month: 'long', day: 'numeric' };
//  const renderListItemComponent: () => React.ReactNode = () => {
//    return sampleList.map((listItem: ListItemType, index: number) => (
//      <ListItem key={index} bcColor={listItem.bcColor} color={listItem.color}>
//        <img src={listItem.imageSrc} alt={`sample list item ${index + 1}`} />
//        <h3>{listItem.title}</h3>
//        <div className="list-item-desc">{listItem.desc}</div>
//        <div className="list-item-date">{listItem.date.toLocaleString("en-US", dateOption)}</div>
//      </ListItem>
//    ))
//  }
//
//  return (
//    <Container color={backgroundColorList[curSelectedListItemId]}>
//      <GlobalStyle />
//      {(responsive.isMobileL && /** display only when mobile screen size **/
//        <React.Fragment>
//          <IndicatorContainer
//          >
//            {renderIndicatorComponents()}
//          </IndicatorContainer>
//          <ListContainer
//            onTouchStart={handleTouchStartEventHandler}
//            onTouchEnd={handleTouchEndEventHandler}
//            ref={listContainerRef}
//          >
//            {renderListItemComponent()}
//          </ListContainer>
//        </React.Fragment>
//      )}
//      {(!responsive.isMobileL &&  /** otherwise, show the message **/
//        <p>Please adjust screen size to be mobile size</p>
//      )}
//    </Container>
//  )
//}


export default App;
