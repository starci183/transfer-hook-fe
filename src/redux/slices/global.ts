
import { createSlice } from "@reduxjs/toolkit"

export enum HomeTab {
  Swap = "swap",
  CreatePair = "create-pair",
  AddLiquidity = "add-liquidity",
}

export enum AddLiquidityTab {
  Deposit = "deposit",
  Position = "position",
}

export interface MainSlice {
  homeTab: HomeTab;
  addLiquidityTab: AddLiquidityTab;
  poolId: number;
  addLiquidityRefreshKey: number;
}

const initialState: MainSlice = {
    homeTab: HomeTab.Swap,
    addLiquidityTab: AddLiquidityTab.Deposit,
    poolId: 0,
    addLiquidityRefreshKey: 0,
}

export const homeSlice = createSlice({
    name: "home",
    initialState,
    reducers: {
        setHomeTab: (state, action) => {
            state.homeTab = action.payload
        },
        setAddLiquidityTab: (state, action) => {
            state.addLiquidityTab = action.payload
        },
        setPoolId: (state, action) => {
            state.poolId = action.payload
        },
        refreshAddLiquidity: (state) => {
            state.addLiquidityRefreshKey++
        },
    },
})

export const homeReducer = homeSlice.reducer
export const {
    setHomeTab,
    setAddLiquidityTab,
    setPoolId,
    refreshAddLiquidity,
} = homeSlice.actions
