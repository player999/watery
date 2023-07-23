import * as React from "react";

import { Button, ButtonGroup, Props, Card, Elevation, Classes, Text, H2, ControlGroup, NumericInput, Checkbox, Overlay, Spinner, FocusStyleManager, H3 } from "@blueprintjs/core";
import { DateInput, TimePrecision } from "@blueprintjs/datetime";

enum WateringPeriodicity {
  Minutely,
  Hourly,
  Daily,
  Weekly,
  Monthly,
  Anually
}

function periodicity2String(per: WateringPeriodicity): string {
  switch(per) {
    case WateringPeriodicity.Anually: return "років";
    case WateringPeriodicity.Daily: return "днів";
    case WateringPeriodicity.Hourly: return "годин";
    case WateringPeriodicity.Minutely: return "хвилин";
    case WateringPeriodicity.Monthly: return "місців";
    case WateringPeriodicity.Weekly: return "тижнів";
  }
}

function string2Periodicity(val: string): WateringPeriodicity {
  var per: WateringPeriodicity = WateringPeriodicity.Anually;
  switch(val) {
    case "років":
      per = WateringPeriodicity.Anually;
      break;
    case "днів":
      per = WateringPeriodicity.Daily;
      break;
    case "годин":
      per = WateringPeriodicity.Hourly;
      break;
    case "хвилин":
      per = WateringPeriodicity.Minutely;
      break;
    case "місяців":
      per = WateringPeriodicity.Monthly;
      break;
    case "тижнів":
      per = WateringPeriodicity.Weekly;
      break;
  }
  return per;
}

function today_time(): number {
  var dt = new Date();
  dt.setMilliseconds(0);
  dt.setSeconds(0);
  return dt.getTime() / 1000;
}

class WateringEntry {
  public volume: number;
  public periodicity: WateringPeriodicity;
  public active: boolean;
  public start_time: number;
  public period: number;
  public static key: number = 0;
  public key: number = 0;
  constructor(volume: number=100, period: number=1, periodicity: WateringPeriodicity=WateringPeriodicity.Anually, start_time?: number, active: boolean = false)
  {
    this.volume = volume;
    this.periodicity = periodicity;
    this.active = active;
    if (typeof start_time === "undefined") {
      start_time = today_time();
    }
    this.start_time = start_time;
    this.period = period;
    this.key = WateringEntry.key;
    WateringEntry.key += 1;
  }
}

interface WateringEntryProps extends Props {
  volume: number;
  periodicity: WateringPeriodicity;
  period: number;
  active: boolean;
  start_time: number;
  key2: number;
  onDelete: (key: number)=>void;
  onUpdate: (key: number, state: WateringEntryState)=>void;
}

interface WateringEntryState {
  volume: number;
  periodicity: WateringPeriodicity;
  period: number;
  active: boolean;
  start_time: number;
}

export class ScheduleEntry extends React.PureComponent<WateringEntryProps, WateringEntryState> {
  constructor(props: WateringEntryProps) {
    super(props);
    this.state = {
      volume: props.volume,
      periodicity: props.periodicity,
      period: props.period,
      active: props.active,
      start_time: props.start_time,
    }
    return;
  }

  private from_timestamp_to_date = (ts: number): Date => {
    var dt = new Date();
    dt.setTime(ts*1000);
    return dt;
  };
  public render() {
    let formatDate = (date: Date, locale?: undefined | string): string => {
      let day = date.getDate(); 
      let mon = date.getMonth() + 1; 
      let yer = date.getFullYear();
      let h = date.getHours();
      let m = date.getMinutes();
      let day_str = (day < 10)?"0" + day.toString():day.toString();
      let mon_str = (mon < 10)?"0" + mon.toString():mon.toString();
      let yer_str = yer.toString();
      let h_str = (h < 10)?"0" + h.toString():h.toString();
      let m_str = (m < 10)?"0" + m.toString():m.toString();
      return `${day_str}.${mon_str}.${yer_str} ${h_str}:${m_str}`;
    };
  
    let parseDate = (str: string, locale?: undefined | string): Date | false | null => {
      return new Date(1989, 7, 11);
    };

    return (<ControlGroup style={{padding: "5px"}}>
        <NumericInput
          value={this.state.volume}
          stepSize={10}
          majorStepSize={50}
          style={{width: "50px"}}
          allowNumericCharactersOnly={true}
          onValueChange={(_valueAsNumber: number, valueAsString: string) => {
            let stat: WateringEntryState = JSON.parse(JSON.stringify(this.state));
            if (_valueAsNumber < 10) {
              stat.volume = 10;
            } else {
              stat.volume = Math.ceil(_valueAsNumber);
            }
            this.setState(stat);
            this.props.onUpdate(this.props.key2, stat);
          }}
        />
        <DateInput
          formatDate={formatDate}
          parseDate={parseDate}
          placeholder="рік.місяць.день"
          timePrecision={TimePrecision.MINUTE}
          timePickerProps={{disabled: false}}
          showTimezoneSelect={false}
          value={this.from_timestamp_to_date(this.state.start_time).toISOString()}
          onChange={(newdate) => {
            let stat: WateringEntryState = JSON.parse(JSON.stringify(this.state));
            if(typeof newdate === "string") {
              var dat = new Date(newdate);
              this.setState({start_time: dat.getTime() / 1000});
              stat.start_time = dat.getTime() / 1000;
            }
            this.props.onUpdate(this.props.key2, stat);
          }}
          minDate={new Date("2023-01-01T10:10Z")}
        />
        <Text style={{position: "relative", marginTop: "auto", marginBottom: "auto"}}>кожні</Text>
        <NumericInput
          value={this.state.period}
          stepSize={1}
          majorStepSize={5}
          style={{width: "50px"}}
          allowNumericCharactersOnly={true}
          onValueChange={(_valueAsNumber: number, valueAsString: string) => {
            let stat: WateringEntryState = JSON.parse(JSON.stringify(this.state));
            if (_valueAsNumber < 1) {
              stat.period = 1;
            } else {
              stat.period = Math.ceil(_valueAsNumber);
            }
            this.setState(stat);
            this.props.onUpdate(this.props.key2, stat);
          }}
        />
        <select className={Classes.INPUT_GROUP} value={periodicity2String(this.state.periodicity)} onChange={(e)=>{
          var per = string2Periodicity(e.target.value);
          let stat: WateringEntryState = JSON.parse(JSON.stringify(this.state));
          stat.periodicity = per;
          this.setState(stat);
          this.props.onUpdate(this.props.key2, stat);
          this.forceUpdate();
        }}>
          <option>{periodicity2String(WateringPeriodicity.Minutely)}</option>
          <option>{periodicity2String(WateringPeriodicity.Hourly)}</option>
          <option>{periodicity2String(WateringPeriodicity.Daily)}</option>
          <option>{periodicity2String(WateringPeriodicity.Weekly)}</option>
          <option>{periodicity2String(WateringPeriodicity.Monthly)}</option>
          <option>{periodicity2String(WateringPeriodicity.Anually)}</option>
        </select>
        <Checkbox large checked={this.state.active}
          onChange={() => {
            let stat: WateringEntryState = JSON.parse(JSON.stringify(this.state));
            stat.active = !stat.active;
            this.setState(stat);
            this.props.onUpdate(this.props.key2, stat);
          }}
          style={{position: "relative", marginTop: "auto", marginBottom: "auto"}}
        />
        <Button icon={"delete"} intent="danger"
          onClick={
            ()=>{
              this.props.onDelete(this.props.key2)
            }
          }
        />
    </ControlGroup>);
  }
}

export interface ScheduleProps extends Props {

}

export interface ScheduleState {
  schedule: Array<WateringEntry>;
  is_loading: boolean;
}

export class Schedule extends React.PureComponent<ScheduleProps, ScheduleState> {
  constructor(props: ScheduleProps) {
    super(props);
    this.state = {
      schedule: [],
      is_loading: true
    }
    this.fetch_schedule();
  }

  private fetch_schedule() {
    this.setState({is_loading: true});
    fetch("/api/get_schedule").then((value: Response) => {
      value.json().then((value: any) => {
        this.setState({is_loading: false});
        this.set_schedule_from_json(value);
      })
    });
  }

  private prepare_put_json(): string {
    var sched: any[] = [];
    for(var i=0; i < this.state.schedule.length; i++) {
      var elem = this.state.schedule[i];
      var putel = {
        active: elem.active,
        period: elem.period,
        periodicity: elem.periodicity,
        start_time: elem.start_time,
        volume: elem.volume
      }
      sched.push(putel);
    }
    return JSON.stringify({schedule: sched});
  }

  private post_schedule() {
    this.setState({is_loading: true});
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: this.prepare_put_json()
    };
    fetch("/api/post_schedule", requestOptions).then((value: Response) => {
      value.text().then((value: string) => {
        this.setState({is_loading: false});
      })
    })
  }

  private set_schedule_from_json(parsed: any) {
    var sched: Array<WateringEntry> = [];
    for(var i = 0; i < parsed.length; i++) {
      sched.push(new WateringEntry(parsed[i].volume, parsed[i].period,
        parsed[i].periodicity, parsed[i].start_time, parsed[i].active));
    }
    this.setState({schedule: sched})
  }

  public render() {
    return (<>
        <Overlay isOpen={this.state.is_loading}>
          <Card style={{position: "relative", marginLeft: "40%", marginRight: "40%", marginTop: "20%", textAlign: "center"}}>
            <H2>Loading...</H2>
            <Spinner/>
          </Card>
        </Overlay>
        {this.state.schedule.map((value: WateringEntry, index: number, Array: WateringEntry[]) => {
          return (<ScheduleEntry
            period={value.period}
            volume={value.volume}
            periodicity={value.periodicity}
            active={value.active}
            start_time={value.start_time}
            key={value.key}
            key2={value.key}
            onDelete={(key: number) => {
              var sched = this.state.schedule;
              sched = sched.filter((val, index, arr) => {
                return val.key !== key;
              });
              this.setState({schedule: sched});
            }}
            onUpdate={(key: number, state: WateringEntryState) => {
              var sched = this.state.schedule;
              for(var i = 0; i < sched.length; i++) {
                if(key === sched[i].key) {
                  sched[i].active = state.active;
                  sched[i].period = state.period;
                  sched[i].periodicity = state.periodicity;
                  sched[i].start_time = state.start_time;
                  sched[i].volume = state.volume;
                }
              }
              this.setState({schedule: sched});
            }}  
          />)
        })}
        <ButtonGroup vertical={false} fill>
          <Button intent="primary" icon="refresh" style={{margin: "10px", width: "100px"}}
            onClick={
              ()=>{
                this.post_schedule()
              }
            }>
          Застосувати
          </Button>
          <Button icon="download" style={{margin: "10px", width: "100px"}}
            onClick={
              ()=>{
                this.fetch_schedule();
              }
            }>
          Скачати з пристрою
          </Button>
          <Button icon="add" style={{margin: "10px", width: "100px"}} onClick={()=>{
            this.state.schedule.push(new WateringEntry());
            this.setState({ schedule: this.state.schedule });
            this.forceUpdate();
          }}> Додати </Button>
        </ButtonGroup>
    </>);
  }
}

interface MotorControlState {
  status: number
  updating: boolean
}

class MotorControl extends React.PureComponent<{}, MotorControlState> {
  constructor(props: any) {
    super(props);
    this.state = {
      status: 0,
      updating: false
    }
    setTimeout(this.refresh_status, 5000, this);
  }

  private refresh_status = (mc: MotorControl) => {
    if ((mc.state.updating == false) && (typeof mc.context !== "undefined")) {
      fetch("/api/motor_status").then((value: Response) => {
        if (value.ok) {
          value.text().then((value: string) => {
            if(value === "1") {
              mc.setState({status: 1});
            } else if (value === "0") {
              mc.setState({status: -1});
            }
          });
        } else {
          mc.setState({status: 0});
        }
      });
    }
    setTimeout(mc.refresh_status, 5000, mc);
  }
  private status2test(): string {
    if(this.state.status == 0) {
      return "не відомо";
    } else if(this.state.status == 1) {
      return "працює";
    } else {
      return "не працює";
    }
  }

  public render() {
    return (
      <Card>
        <H3>Керування моторчиком</H3>
        <Text>Cтатус: {this.status2test()}</Text>
        <div>
          <Button disabled={this.state.updating} style={{margin: "10px", width: "100px"}} onClick={() => {
            this.setState({updating: true});
            fetch("/api/motor_on").then((value: Response) => {
              if(value.status == 200) this.setState({status: 1});
              this.setState({updating: false});
            })
          }}>Увімкнути</Button>
          <Button disabled={this.state.updating} style={{margin: "10px", width: "100px"}} onClick={() => {
            this.setState({updating: true});
            fetch("/api/motor_off").then((value: Response) => {
              if(value.status == 200) this.setState({status: -1});
              this.setState({updating: false});
            })
          }}>Вимкнути</Button>
        </div>
      </Card>
    )
  }
}

export default class App extends React.PureComponent {
  public render() {
    FocusStyleManager.onlyShowFocusOnTabs();
    return (<div style={{margin: "0 auto", width: "650px", marginTop: "50px"}}>
      <Card elevation={Elevation.TWO}>
        <H2>Поливалочка</H2>
        <Schedule />
        <MotorControl/>
      </Card>
    </div>);
  }
}
