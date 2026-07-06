import { PieChart } from '@mui/x-charts';
import { Gauge } from '@mui/x-charts/Gauge';

const settings = {
  margin: { right: 5 },
  width: 500,
  height: 500,
  hideLegend: false,
};

const AttendancePieChart = ({ attendance }) => {
  if (!attendance) {
    return null;
  }

  const data = [
    { label: 'Present', value: attendance.present, color: 'green' },
    { label: 'Absent', value: attendance.absent, color: 'red' },
    { label: 'Leave', value: attendance.leave, color: 'gold' },
  ].filter((item) => item.value > 0);
  const isEmpty =
    attendance.present === 0 &&
    attendance.absent === 0 &&
    attendance.leave === 0;

  if (isEmpty) {
    return <div className='flex item-center justify-center' ><Gauge width={500} height={500} value={"No Attendance for toady"}/></div>
  }

  return (
    <PieChart
      series={[{
        innerRadius: 50,
        outerRadius: 200,
        data,
        arcLabel: 'value',
      }]}
      {...settings}
    />
  );
};

export default AttendancePieChart;