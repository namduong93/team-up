import { http, HttpResponse } from 'msw';
import { backendURL } from '../../config/backendURLConfig';
import { CourseCategory } from '../../shared_types/University/Course';
import { StaffAccess, StaffInfo } from '../../shared_types/Competition/staff/StaffInfo';
import { UserAccess } from '../../shared_types/User/User';
import { CompetitionRole } from '../../shared_types/Competition/CompetitionRole';
import { Notification } from '../components/page_header/components/NotificationButton';

export const handlers = [

  http.get(`${backendURL.HOST}:${backendURL.PORT}/user/type`, async ({ params }) => {

    const res = HttpResponse.json({ type: 'system_admin' }, { status: 200 });
    return res;
  }),

  http.get(`${backendURL.HOST}:${backendURL.PORT}/competition/students/rego_toggles`, async () => {
    return HttpResponse.json({
      regoFields: {
        enableCodeforcesField: true,
        enableNationalPrizesField: true,
        enableInternationalPrizesField: true,
        enableRegionalParticipationField: true,
      }
    });
  }),

  http.get(`${backendURL.HOST}:${backendURL.PORT}/university/courses`, async () => {
    return HttpResponse.json({
      courses: [
        {
          category: CourseCategory.Introduction, courseName: '1511',
        },
        {
          category: CourseCategory.DataStructures, courseName: '2521',
        },
        {
          category: CourseCategory.AlgorithmDesign, courseName: '3121',
        },
        {
          category: CourseCategory.ProgrammingChallenges, courseName: '4128'
        }
      ]}
    );
  }),

  http.get(`${backendURL.HOST}:${backendURL.PORT}/user/staff_requests`, async () => {
    return HttpResponse.json<{staffRequests: Array<StaffInfo>}>({
      staffRequests: [
        {
          userId: 1,
          universityId: 1,
          universityName: 'UNSW',
          name: 'person 1 name',
          email: 'person1@example.com',
          sex: 'M',
          pronouns: 'he/him',
          tshirtSize: 'MXL',
          allergies: '',
          dietaryReqs: '',
          accessibilityReqs: '',
          userAccess: UserAccess.Pending,
          
          bio: 'person 1 bio',
          roles: [CompetitionRole.Coach],
          access: StaffAccess.Pending
        },
        {
          userId: 2,
          universityId: 2,
          universityName: 'UNSW',
          name: 'person 2 name',
          email: 'person2@example.com',
          sex: 'M',
          pronouns: 'he/him',
          tshirtSize: 'MXL',
          allergies: '',
          dietaryReqs: '',
          accessibilityReqs: '',
          userAccess: UserAccess.Pending,
          
          bio: 'person 2 bio',
          roles: [CompetitionRole.Coach],
          access: StaffAccess.Pending
        },
      ]
    })
  }),

  http.get(`${backendURL.HOST}:${backendURL.PORT}/user/notifications`, async () => {

    return HttpResponse.json<Notification[]>(
      [
        {
          id: 1,
          type: 'name',
          message: 'msg',
          createdAt: new Date(),
        }
      ]
    )
  })


]