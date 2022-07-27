import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../redux/hooks';
import { getTodayFoods, importToggle } from '../../../redux/importInterFood';
import { RootState } from '../../../redux/store';
import { getTodayDateAsString, nextDay, previousDay, todayDay } from '../../../redux/today';
import { FoodProperite } from '../../../types/interfood';
import { floatAnimationOnScrollEvent, initFollowerToFood } from '../../../utils/util';
import { ImportForm } from '../../DiaryCommon/ImportForm';
import Table from '../../Table';
import { foodInnerProps } from '../../Table/Food';
import "./index.scss";

function sumCh<T extends { portion: number, props: FoodProperite }>(items: T[]) {
  return items.reduce(function (a, b) {
    const num: number = b.portion / b.props.gramm
    return a + (b.props.ch * num);
  }, 0);
}

const Today = () => {

  const { everyHalfHour, todayDateAsString, todayDate } = useAppSelector(state => state.today)
  const userData = useAppSelector(state => state.user.data)
  const diaryFood = useAppSelector(state => state.importIF.diaryFood)
  const [todayFoods, setTodayFoods] = useState([] as foodInnerProps[]);
  const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();

  useEffect(() => {
    dispatch(getTodayDateAsString())
  }, [dispatch]);

  useEffect(() => {
    if (todayDateAsString !== "1970-01-01" && userData.nickname !== "") {
      console.log("Today", diaryFood.length, todayDate, todayDateAsString, diaryFood, everyHalfHour, userData);
      dispatch(
        getTodayFoods(
          { user: userData.nickname, date: todayDateAsString }
        )
      );

    } else {
      console.warn("Something is empty: ", todayDateAsString, userData.nickname);
    }

  }, [todayDateAsString]);

  useEffect(() => {
    setTodayFoods(diaryFood.filter(data => data.date === todayDateAsString))
  }, [diaryFood]);

  useEffect(() => {
    console.log("todayFoods: ", todayFoods);
    if (todayFoods.length > 0) {
      initFollowerToFood()
    }
  }, [todayFoods]);

  const htmlRender = () => {
    return (
      <div className="todayContainer">

        <div className="importInterFoodContainer">
          <button className="importInterFood" onClick={() => { dispatch(importToggle()) }} > Import </button>
          <ImportForm />
        </div>

        <div className="information">
          <div className="centerColumn">

            <div className='dateChanger'>
              <div className="previousDay"> <button onClick={() => { dispatch(previousDay()) }} > &lt; </button></div>
              <div className="todayDay"> <button onClick={() => { dispatch(todayDay()) }} > {todayDateAsString} </button></div>
              <div className="nextDay"> <button onClick={() => { dispatch(nextDay()) }} > &gt; </button></div>
            </div>

            <div className="chInformation">
              <div className="sumCh">Sum ch: {Number(sumCh(todayFoods)).toFixed(2)}</div>
              <div className="leftCh">Left ch: {Number(180 - sumCh(todayFoods)).toFixed(2)}</div>
            </div>

          </div>
        </div>
        <div className="tableContent">
          <div className="chDiaryMain" onScroll={(ev) => { ev.preventDefault(); floatAnimationOnScrollEvent() }}>{
            todayFoods.length > 0 && <Table foodList={todayFoods} />
          }</div>
        </div>

      </div >
    );
  }

  return (
    <>{
      userData.nickname && htmlRender()
    }</>
  );
}

export default Today;
