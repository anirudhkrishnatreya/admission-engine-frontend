export default function ReportsTable({ data }) {
  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">University</th>
            <th className="p-3 text-left">Cohort</th>
            <th className="p-3 text-left">Qualification</th>
            <th className="p-3 text-left">Grad Year</th>
            <th className="p-3 text-left">Score</th>
            <th className="p-3 text-left">Interview</th>
            <th className="p-3 text-left">Exceptions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((student) => (
            <tr key={student._id} className="border-t hover:bg-gray-50">
              <td className="p-3">{student.fullName}</td>
              <td className="p-3">{student.email}</td>
              <td className="p-3">{student.phone}</td>
              <td className="p-3">{student.institution}</td>
              <td className="p-3">{student.cohort}</td>
              <td className="p-3">{student.qualification}</td>
              <td className="p-3">{student.graduationYear}</td>
              <td className="p-3">{student.screeningScore}</td>
              <td className="p-3">{student.interviewStatus}</td>
              <td className="p-3">{student.exceptions?.length || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}